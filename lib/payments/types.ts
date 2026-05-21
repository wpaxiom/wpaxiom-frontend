// Gateway-agnostic payment types. Every provider (Paddle today, Stripe / PayPal /
// FastSpring later) maps its native webhook payload into NormalizedEvent so the
// processor never needs to know which gateway sent the request.

export type GatewaySlug = "paddle" | "stripe" | "paypal" | "fastspring";

export type NormalizedEventType =
  | "transaction.completed"
  | "transaction.payment_failed"
  | "subscription.activated"
  | "subscription.updated"
  | "subscription.cancelled"
  | "refund.issued";

export type NormalizedCustomer = {
  gatewayCustomerId: string;
  email: string;
  name?: string;
};

export type NormalizedLineItem = {
  gatewayPriceId: string;
  wcVariationId?: number;
  quantity: number;
  amount: number; // major units, e.g. 59.00
  currency: string;
};

export type NormalizedTransaction = {
  gatewayTransactionId: string;
  gatewaySubscriptionId?: string;
  total: number; // major units
  currency: string;
  items: NormalizedLineItem[];
  customData?: Record<string, unknown>;
  // True when this transaction is an automatic subscription renewal (not the
  // initial checkout). Determined per-gateway — e.g. Paddle sets origin
  // "subscription_recurring" on renewals.
  isRenewal?: boolean;
};

export type NormalizedSubscription = {
  gatewaySubscriptionId: string;
  status: "active" | "trialing" | "paused" | "past_due" | "cancelled";
  currentPeriodEnd?: string; // ISO 8601
  cancelAt?: string;
};

export type NormalizedEvent = {
  gateway: GatewaySlug;
  gatewayEventId: string; // for idempotency / dedupe
  type: NormalizedEventType;
  occurredAt: string;
  customer: NormalizedCustomer;
  transaction?: NormalizedTransaction;
  subscription?: NormalizedSubscription;
};

export interface PaymentProvider {
  slug: GatewaySlug;
  // Verifies the signature and returns a normalized event. Returns null for
  // invalid signatures, unsupported event types, or malformed payloads.
  parseWebhook(rawBody: string, headers: Headers): Promise<NormalizedEvent | null>;
}
