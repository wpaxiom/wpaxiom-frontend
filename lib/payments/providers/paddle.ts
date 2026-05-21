// Paddle Billing adapter. Wraps the official @paddle/paddle-node-sdk so
// signature verification + event parsing happen inside `unmarshal()` and we
// only normalize the small subset of fields the processor cares about.

import {
  Environment,
  EventName,
  LogLevel,
  Paddle,
  type TransactionCompletedEvent,
  type TransactionPaymentFailedEvent,
  type SubscriptionCanceledEvent,
  type SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";
import type {
  NormalizedEvent,
  NormalizedLineItem,
  PaymentProvider,
} from "../types";

let paddleInstance: Paddle | null = null;

function getPaddle(): Paddle {
  if (paddleInstance) return paddleInstance;
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) throw new Error("PADDLE_API_KEY is not set");
  paddleInstance = new Paddle(apiKey, {
    environment:
      process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
        ? Environment.production
        : Environment.sandbox,
    logLevel: LogLevel.error,
  });
  return paddleInstance;
}

// Paddle returns amounts as strings in minor units ("5900" = $59.00).
function minorToMajor(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(num) ? num / 100 : 0;
}

function readWcVariationId(customData: unknown): number | undefined {
  if (!customData || typeof customData !== "object") return undefined;
  const raw = (customData as Record<string, unknown>).wc_variation_id;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const parsed = parseInt(raw, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

async function lookupCustomer(customerId: string): Promise<{ email: string; name?: string }> {
  try {
    const customer = await getPaddle().customers.get(customerId);
    return {
      email: customer.email ?? "",
      name: customer.name ?? undefined,
    };
  } catch (e) {
    console.warn(`[paddle] customers.get(${customerId}) failed:`, e);
    return { email: "" };
  }
}

async function buildTransactionCompleted(
  event: TransactionCompletedEvent
): Promise<NormalizedEvent | null> {
  const data = event.data;
  const customerId = data.customerId;
  if (!customerId) return null;

  const { email, name } = await lookupCustomer(customerId);
  if (!email) return null;

  const customData = (data.customData as Record<string, unknown> | null) ?? undefined;
  const wcVariationId = readWcVariationId(customData);
  const currency = data.currencyCode ?? "USD";

  // Per-item totals live under data.details.lineItems, not data.items.
  // data.items only carries price + quantity; lineItems carries the totals.
  const lineItems = data.details?.lineItems ?? [];
  const items: NormalizedLineItem[] = lineItems.map((line) => ({
    gatewayPriceId: line.priceId,
    wcVariationId, // top-level customData carries variation for single-item checkout
    quantity: line.quantity,
    amount: minorToMajor(line.totals?.total ?? null),
    currency,
  }));

  // Paddle marks origin "subscription_recurring" on auto-renewals. Initial
  // subscription checkout has origin "web". Anything else (subscription_update,
  // subscription_payment_method_change, etc.) we treat as non-renewal too — the
  // renewal-successful email is reserved strictly for auto-billed renewals.
  const origin = (data as { origin?: string }).origin;
  const isRenewal = origin === "subscription_recurring";

  return {
    gateway: "paddle",
    gatewayEventId: event.eventId,
    type: "transaction.completed",
    occurredAt: event.occurredAt,
    customer: {
      gatewayCustomerId: customerId,
      email,
      name,
    },
    transaction: {
      gatewayTransactionId: data.id,
      gatewaySubscriptionId: data.subscriptionId ?? undefined,
      total: minorToMajor(data.details?.totals?.total ?? null),
      currency,
      items,
      customData,
      isRenewal,
    },
  };
}

async function buildTransactionPaymentFailed(
  event: TransactionPaymentFailedEvent
): Promise<NormalizedEvent | null> {
  const data = event.data;
  const customerId = data.customerId;
  if (!customerId) return null;

  const { email, name } = await lookupCustomer(customerId);
  if (!email) return null;

  const currency = data.currencyCode ?? "USD";

  return {
    gateway: "paddle",
    gatewayEventId: event.eventId,
    type: "transaction.payment_failed",
    occurredAt: event.occurredAt,
    customer: { gatewayCustomerId: customerId, email, name },
    transaction: {
      gatewayTransactionId: data.id,
      gatewaySubscriptionId: data.subscriptionId ?? undefined,
      total: minorToMajor(data.details?.totals?.total ?? null),
      currency,
      items: [],
      customData: (data.customData as Record<string, unknown> | null) ?? undefined,
    },
  };
}

async function buildSubscriptionCancelled(
  event: SubscriptionCanceledEvent
): Promise<NormalizedEvent | null> {
  const data = event.data;
  const customerId = data.customerId;
  if (!customerId) return null;

  const { email, name } = await lookupCustomer(customerId);
  if (!email) return null;

  return {
    gateway: "paddle",
    gatewayEventId: event.eventId,
    type: "subscription.cancelled",
    occurredAt: event.occurredAt,
    customer: { gatewayCustomerId: customerId, email, name },
    subscription: {
      gatewaySubscriptionId: data.id,
      status: "cancelled",
      currentPeriodEnd: data.currentBillingPeriod?.endsAt ?? undefined,
      cancelAt: data.canceledAt ?? undefined,
    },
  };
}

async function buildSubscriptionUpdated(
  event: SubscriptionUpdatedEvent
): Promise<NormalizedEvent | null> {
  const data = event.data;
  const customerId = data.customerId;
  if (!customerId) return null;

  const { email, name } = await lookupCustomer(customerId);
  if (!email) return null;

  // Map Paddle's SubscriptionStatus (American "canceled") to our normalized
  // status (British "cancelled").
  const statusMap: Record<string, "active" | "trialing" | "paused" | "past_due" | "cancelled"> = {
    active: "active",
    trialing: "trialing",
    paused: "paused",
    past_due: "past_due",
    canceled: "cancelled",
  };

  return {
    gateway: "paddle",
    gatewayEventId: event.eventId,
    type: "subscription.updated",
    occurredAt: event.occurredAt,
    customer: { gatewayCustomerId: customerId, email, name },
    subscription: {
      gatewaySubscriptionId: data.id,
      status: statusMap[data.status] ?? "active",
      currentPeriodEnd: data.currentBillingPeriod?.endsAt ?? undefined,
    },
  };
}

async function parseWebhook(
  rawBody: string,
  headers: Headers
): Promise<NormalizedEvent | null> {
  const signature = headers.get("paddle-signature");
  const secret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET;
  if (!signature || !secret) {
    console.warn("[paddle] missing paddle-signature header or PADDLE_NOTIFICATION_WEBHOOK_SECRET");
    return null;
  }

  let event;
  try {
    event = await getPaddle().webhooks.unmarshal(rawBody, secret, signature);
  } catch (e) {
    console.warn("[paddle] unmarshal failed (likely bad signature):", e);
    return null;
  }
  if (!event) return null;

  switch (event.eventType) {
    case EventName.TransactionCompleted:
      return buildTransactionCompleted(event as TransactionCompletedEvent);
    case EventName.TransactionPaymentFailed:
      return buildTransactionPaymentFailed(event as TransactionPaymentFailedEvent);
    case EventName.SubscriptionCanceled:
      return buildSubscriptionCancelled(event as SubscriptionCanceledEvent);
    case EventName.SubscriptionUpdated:
      return buildSubscriptionUpdated(event as SubscriptionUpdatedEvent);
    default:
      console.log(`[paddle] unhandled event type: ${event.eventType}`);
      return null;
  }
}

export const paddleProvider: PaymentProvider = {
  slug: "paddle",
  parseWebhook,
};
