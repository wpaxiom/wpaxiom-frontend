import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/payments/registry";
import { processEvent } from "@/lib/payments/processor";

// In-memory idempotency cache. Paddle retries webhooks when our response
// exceeds its timeout (~5s), and our handler takes ~4-5s on a cold WP REST API
// — comfortably within the retry window. Dedup by Paddle event_id so retries
// become fast no-ops instead of creating duplicate orders/subscriptions/licenses.
//
// In-process cache: fine for single-instance dev / single Vercel function.
// For multi-instance prod, swap to a shared store (Redis) or a WC meta lookup.
const recentEventIds = new Map<string, number>();
const DEDUP_TTL_MS = 10 * 60 * 1000; // 10 minutes — well beyond Paddle's retry window

function isDuplicateEvent(eventId: string): boolean {
  // Sweep expired entries first
  const now = Date.now();
  if (recentEventIds.size > 500) {
    for (const [id, ts] of recentEventIds) {
      if (now - ts > DEDUP_TTL_MS) recentEventIds.delete(id);
    }
  }
  if (recentEventIds.has(eventId)) return true;
  recentEventIds.set(eventId, now);
  return false;
}

// Paddle's webhook signature is computed over the raw request body, so we must
// read it as text (not JSON-parse via Next).
export async function POST(request: NextRequest) {
  const provider = getProvider("paddle");
  if (!provider) {
    return NextResponse.json(
      { error: "Paddle provider not registered" },
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  // Peek at the event type *before* signature verification so we can report it
  // in the response even when the event is skipped. Not used for processing.
  let peekedType = "unknown";
  let peekedEventId = "unknown";
  try {
    const parsed = JSON.parse(rawBody);
    if (parsed && typeof parsed === "object") {
      peekedType = String(parsed.event_type ?? "unknown");
      peekedEventId = String(parsed.event_id ?? "unknown");
    }
  } catch {
    // body wasn't valid JSON — leave peeked defaults
  }

  console.log(`[webhook/paddle] received: ${peekedType} (${peekedEventId})`);

  // Idempotency: bail before any expensive work if we've already seen this event.
  // Crucial because parseWebhook does a Paddle API call (customers.get) which is
  // slow, and the processor then does multiple WC API calls. Without this,
  // Paddle's retries create duplicate orders/subscriptions/licenses.
  if (peekedEventId !== "unknown" && isDuplicateEvent(peekedEventId)) {
    console.log(`[webhook/paddle] duplicate (already processed): ${peekedType} (${peekedEventId})`);
    return NextResponse.json({
      status: "duplicate",
      eventType: peekedType,
      eventId: peekedEventId,
    });
  }

  const event = await provider.parseWebhook(rawBody, request.headers);

  if (!event) {
    // Reasons for null: bad signature, unsupported event type, customer lookup
    // failed, or malformed body. The Paddle adapter logs the specific reason.
    console.log(
      `[webhook/paddle] skipped: ${peekedType} (${peekedEventId}) — check earlier [paddle] log lines for reason`
    );
    return NextResponse.json({
      status: "skipped",
      eventType: peekedType,
      eventId: peekedEventId,
      hint: "check Next.js terminal for [paddle] log lines explaining why this event was not processed",
    });
  }

  const result = await processEvent(event);

  if (!result.ok) {
    console.warn(
      `[webhook/paddle] processing ${event.type} (${event.gatewayEventId}) failed: ${result.reason}`
    );
    return NextResponse.json({ error: result.reason }, { status: 500 });
  }

  console.log(
    `[webhook/paddle] processed ${event.type} (${event.gatewayEventId})${
      result.orderId ? ` -> order ${result.orderId}` : ""
    }${result.subscriptionId ? `, subscription ${result.subscriptionId}` : ""}${
      result.skipped ? ` (${result.skipped})` : ""
    }`
  );

  return NextResponse.json({
    status: "ok",
    eventType: event.type,
    eventId: event.gatewayEventId,
    orderId: result.orderId,
    subscriptionId: result.subscriptionId,
    licenseCount: result.licenses?.length ?? 0,
  });
}
