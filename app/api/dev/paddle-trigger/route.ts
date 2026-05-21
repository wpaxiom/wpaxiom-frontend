// DEV-ONLY endpoint. Accepts a NormalizedEvent JSON payload and runs it through
// the processor (creates a WC order) without involving Paddle signature
// verification. Refuses to run in production.
//
// Usage:
//   curl -X POST http://localhost:3000/api/dev/paddle-trigger \
//     -H "Content-Type: application/json" \
//     -d @scripts/sample-paddle-event.json
//
// When real Paddle webhook delivery is wired up, the normal /api/webhooks/paddle
// route handles signed events. This endpoint is for testing only.

import { NextRequest, NextResponse } from "next/server";
import { processEvent } from "@/lib/payments/processor";
import type { NormalizedEvent } from "@/lib/payments/types";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Dev-only endpoint — disabled in production" },
      { status: 404 }
    );
  }

  let event: NormalizedEvent;
  try {
    event = (await request.json()) as NormalizedEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !event?.gateway ||
    !event?.type ||
    !event?.gatewayEventId ||
    !event?.customer?.email
  ) {
    return NextResponse.json(
      {
        error:
          "Missing required NormalizedEvent fields (gateway, type, gatewayEventId, customer.email)",
      },
      { status: 400 }
    );
  }

  console.log(
    `[dev/paddle-trigger] simulating ${event.type} for ${event.customer.email}`
  );
  const result = await processEvent(event);
  return NextResponse.json(result);
}
