// Gateway-agnostic event processor. Takes a NormalizedEvent (from any provider)
// and reconciles it with WooCommerce.
//
// Subscriptions: the wpaxiom-licensing plugin issues licenses on the
// `woocommerce_subscription_payment_complete` hook. So when the Paddle event
// represents a subscription transaction, we MUST create a WC Subscription
// (not just a WC order) — otherwise no license ever gets generated.

import type { NormalizedEvent } from "./types";
import {
  createCustomer,
  createSubscription,
  createRenewalOrder,
  updateOrder,
  updateSubscription,
  getCustomerByEmail,
  listSubscriptions,
  type CreateSubscriptionLineItem,
  type WCCustomer,
  type WCSubscriptionListItem,
} from "@/lib/wp-api";
import {
  generatePasswordResetLink,
  issueLicensesForSubscription,
  renewLicensesForSubscription,
  refundByTransaction,
  type IssuedLicense,
} from "@/lib/wpaxiom-admin";
import { sendEmail } from "@/lib/emails/send";

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

function wcAuthHeader(): string | null {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) return null;
  return (
    "Basic " +
    Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
  );
}

type ProcessResult =
  | {
      ok: true;
      orderId?: number;
      subscriptionId?: number;
      customerId?: number;
      customerCreated?: boolean;
      licenses?: IssuedLicense[];
      subscriptionError?: { status: number; body: string };
      licenseError?: string;
      skipped?: string;
    }
  | { ok: false; reason: string };

type WCOrderCreateBody = {
  status: string;
  currency: string;
  customer_id?: number;
  set_paid: boolean;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  billing: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  line_items: { variation_id?: number; product_id?: number; quantity: number; total?: string }[];
  meta_data: { key: string; value: string }[];
};

function mysqlUtc(d: Date): string {
  return d.toISOString().replace("T", " ").replace(/\.\d+Z$/, "");
}

async function findWcSubByPaddleId(
  customerId: number,
  paddleSubId: string
): Promise<WCSubscriptionListItem | null> {
  const subs = await listSubscriptions({ customerId, status: "any", perPage: 50 });
  return (
    subs.find((s) =>
      s.meta_data.some(
        (m) => m.key === "_paddle_subscription_id" && String(m.value) === paddleSubId
      )
    ) ?? null
  );
}

export async function processEvent(event: NormalizedEvent): Promise<ProcessResult> {
  switch (event.type) {
    case "transaction.completed":
      return handleTransactionCompleted(event);
    case "transaction.payment_failed":
      return handlePaymentFailed(event);
    case "subscription.cancelled":
      return handleSubscriptionCancelled(event);
    case "subscription.activated":
      return handleSubscriptionActivated(event);
    case "refund.issued":
      return handleRefund(event);
    case "subscription.updated":
      console.log(`[processor] event ${event.type} acknowledged but not yet handled`);
      return { ok: true, skipped: `${event.type} not yet handled` };
    default:
      return { ok: false, reason: `unknown event type: ${(event as { type: string }).type}` };
  }
}

async function handlePaymentFailed(event: NormalizedEvent): Promise<ProcessResult> {
  if (!event.transaction) {
    return { ok: false, reason: "transaction.payment_failed event missing transaction data" };
  }

  const customerName =
    event.customer.name?.trim().split(/\s+/)[0] ||
    event.customer.email.split("@")[0];

  // Paddle's dunning typically retries within 1–3 days. We don't get the exact
  // next-retry timestamp on the event, so show "in a few days" framing via a
  // 3-day estimate. Customers care more that there's a grace period than the
  // exact retry minute.
  const retry = new Date(event.occurredAt);
  retry.setUTCDate(retry.getUTCDate() + 3);

  await sendPaymentFailedEmail({
    to: event.customer.email,
    customerName,
    amount: formatAmount(event.transaction.total, event.transaction.currency),
    retryDate: formatHumanDate(retry),
  });

  return {
    ok: true,
    customerId: undefined,
    skipped: "payment failed — dunning email sent",
  };
}

async function handleSubscriptionCancelled(event: NormalizedEvent): Promise<ProcessResult> {
  if (!event.subscription) {
    return { ok: false, reason: "subscription.cancelled event missing subscription data" };
  }

  const customerName =
    event.customer.name?.trim().split(/\s+/)[0] ||
    event.customer.email.split("@")[0];

  const cancellationDate = new Date(event.subscription.cancelAt ?? event.occurredAt);
  const accessUntil = event.subscription.currentPeriodEnd
    ? new Date(event.subscription.currentPeriodEnd)
    : cancellationDate;

  await sendSubscriptionCancelledEmail({
    to: event.customer.email,
    customerName,
    cancellationDate: formatHumanDate(cancellationDate),
    accessUntilDate: formatHumanDate(accessUntil),
  });

  // PUT /wc/v3/subscriptions/{id} status=cancelled → WC fires
  // woocommerce_subscription_status_cancelled → license set to cancelled.
  const paddleSubId = event.subscription.gatewaySubscriptionId;
  let wcSubscriptionId: number | undefined;

  if (paddleSubId) {
    const customer = await getCustomerByEmail(event.customer.email);
    if (customer) {
      const wcSub = await findWcSubByPaddleId(customer.id, paddleSubId);
      if (wcSub) {
        wcSubscriptionId = wcSub.id;
        await updateSubscription(wcSub.id, { status: "cancelled" });
        console.log(`[processor] cancellation: WC sub ${wcSub.id} set to cancelled`);
      } else {
        console.warn(`[processor] cancellation: could not find WC sub for Paddle sub ${paddleSubId}`);
      }
    }
  }

  return { ok: true, subscriptionId: wcSubscriptionId };
}

async function handleSubscriptionActivated(event: NormalizedEvent): Promise<ProcessResult> {
  if (!event.subscription) {
    return { ok: false, reason: "subscription.activated event missing subscription data" };
  }

  // PUT /wc/v3/subscriptions/{id} status=active → WC fires
  // woocommerce_subscription_status_active → license set to active.
  const paddleSubId = event.subscription.gatewaySubscriptionId;
  let wcSubscriptionId: number | undefined;

  if (paddleSubId) {
    const customer = await getCustomerByEmail(event.customer.email);
    if (customer) {
      const wcSub = await findWcSubByPaddleId(customer.id, paddleSubId);
      if (wcSub) {
        wcSubscriptionId = wcSub.id;
        await updateSubscription(wcSub.id, { status: "active" });
        console.log(`[processor] activation: WC sub ${wcSub.id} set to active`);
      } else {
        console.warn(`[processor] activation: could not find WC sub for Paddle sub ${paddleSubId}`);
      }
    }
  }

  return { ok: true, subscriptionId: wcSubscriptionId };
}

async function handleRefund(event: NormalizedEvent): Promise<ProcessResult> {
  if (!event.transaction) {
    return { ok: false, reason: "refund.issued event missing transaction data" };
  }

  const transactionId = event.transaction.gatewayTransactionId;
  const result = await refundByTransaction(transactionId);

  if (result.ok) {
    console.log(`[processor] refund: order ${result.order_id} marked refunded for transaction ${transactionId}`);
  } else {
    console.warn(`[processor] refund: refundByTransaction failed for ${transactionId}: ${result.body}`);
  }

  return { ok: true };
}

async function handleTransactionCompleted(event: NormalizedEvent): Promise<ProcessResult> {
  if (!event.transaction) {
    return { ok: false, reason: "transaction.completed event missing transaction data" };
  }
  if (!wcAuthHeader()) {
    return { ok: false, reason: "WC_CONSUMER_KEY / WC_CONSUMER_SECRET not configured" };
  }

  const lineItems = event.transaction.items
    .filter((item) => item.wcVariationId)
    .map((item) => ({
      variation_id: item.wcVariationId!,
      quantity: item.quantity,
      subtotal: item.amount.toFixed(2),
      total: item.amount.toFixed(2),
    }));

  if (lineItems.length === 0) {
    return { ok: false, reason: "no WC variation IDs in custom_data — cannot create order" };
  }

  const [firstName, ...lastParts] = (event.customer.name ?? "").trim().split(/\s+/);
  const lastName = lastParts.join(" ");

  // Find or create the WC customer so the order/subscription links to a real WP user.
  let wcCustomer = await getCustomerByEmail(event.customer.email);
  let customerCreated = false;
  if (!wcCustomer) {
    wcCustomer = await createCustomer({
      email: event.customer.email,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    });
    customerCreated = wcCustomer !== null;
    if (!wcCustomer) {
      console.warn(
        `[processor] failed to create WC customer for ${event.customer.email} — falling back to guest`
      );
    }
  }

  const isSubscription = !!event.transaction.gatewaySubscriptionId;

  // Subscription renewals: skip the parent-order/subscription create path
  // (those already exist from the initial checkout). Just send the receipt.
  // TODO: update WC subscription's next_payment_date by looking up the WC
  // subscription via _paddle_subscription_id meta. Without that, the Renewal
  // Upcoming cron will keep using the original next_payment_date.
  if (isSubscription && event.transaction.isRenewal) {
    return handleRenewal(event, wcCustomer);
  }

  if (isSubscription) {
    return createOrderAndSubscription(event, wcCustomer, customerCreated, lineItems, firstName, lastName);
  }

  // One-time purchase path: just create the order. License issuance for plain
  // orders is not yet wired in the wpaxiom plugin.
  return createOneTimeOrder(event, wcCustomer, customerCreated, lineItems, firstName, lastName);
}

async function handleRenewal(
  event: NormalizedEvent,
  wcCustomer: WCCustomer | null
): Promise<ProcessResult> {
  if (!event.transaction) return { ok: false, reason: "no transaction on renewal" };

  const customerName =
    event.customer.name?.trim().split(/\s+/)[0] ||
    event.customer.email.split("@")[0];

  const cycle = readString(event.transaction.customData, "cycle") ?? "yearly";
  const next = new Date(event.occurredAt);
  if (cycle === "monthly") {
    next.setUTCMonth(next.getUTCMonth() + 1);
  } else {
    next.setUTCFullYear(next.getUTCFullYear() + 1);
  }

  await sendRenewalSuccessfulEmail({
    to: event.customer.email,
    customerName,
    amount: formatAmount(event.transaction.total, event.transaction.currency),
    renewalDate: formatHumanDate(new Date(event.occurredAt)),
    nextRenewalDate: formatHumanDate(next),
    invoiceUrl: `${SITE_URL}/account/invoices`,
  });

  const paddleSubId = event.transaction.gatewaySubscriptionId;
  const transactionId = event.transaction.gatewayTransactionId;
  let wcSubscriptionId: number | undefined;

  if (paddleSubId && wcCustomer) {
    const wcSub = await findWcSubByPaddleId(wcCustomer.id, paddleSubId);
    if (wcSub) {
      wcSubscriptionId = wcSub.id;

      // Step 1: WC REST API creates renewal order + marks completed
      // → WC Subscriptions updates next_payment_date automatically.
      const renewalOrder = await createRenewalOrder(wcSub.id);
      if (renewalOrder) {
        await updateOrder(renewalOrder.id, { status: "completed", transaction_id: transactionId });
        console.log(`[processor] renewal: WC renewal order ${renewalOrder.id} created and completed`);
      }

      // Step 2: Extend license — WC doesn't know about our license table.
      const expiresAt = mysqlUtc(next);
      await renewLicensesForSubscription(wcSub.id, expiresAt);
      console.log(`[processor] renewal: license extended to ${expiresAt}`);
    } else {
      console.warn(`[processor] renewal: could not find WC subscription for Paddle sub ${paddleSubId}`);
    }
  }

  return {
    ok: true,
    customerId: wcCustomer?.id,
    subscriptionId: wcSubscriptionId,
  };
}

async function createOneTimeOrder(
  event: NormalizedEvent,
  wcCustomer: WCCustomer | null,
  customerCreated: boolean,
  lineItems: { variation_id: number; quantity: number; subtotal: string; total: string }[],
  firstName: string,
  lastName: string
): Promise<ProcessResult> {
  const auth = wcAuthHeader()!;
  if (!event.transaction) return { ok: false, reason: "no transaction" };

  const body: WCOrderCreateBody = {
    status: "completed",
    currency: event.transaction.currency,
    customer_id: wcCustomer?.id,
    set_paid: true,
    payment_method: event.gateway,
    payment_method_title: capitalize(event.gateway),
    transaction_id: event.transaction.gatewayTransactionId,
    billing: {
      email: event.customer.email,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    },
    line_items: lineItems,
    meta_data: gatewayMeta(event),
  };

  const order = await postWC<{ id: number }>("/wc/v3/orders", body);
  if (!order) return { ok: false, reason: "WC order create failed" };

  return {
    ok: true,
    orderId: order.id,
    customerId: wcCustomer?.id,
    customerCreated,
  };
}

async function createOrderAndSubscription(
  event: NormalizedEvent,
  wcCustomer: WCCustomer | null,
  customerCreated: boolean,
  lineItems: { variation_id: number; quantity: number; subtotal: string; total: string }[],
  firstName: string,
  lastName: string
): Promise<ProcessResult> {
  if (!event.transaction) return { ok: false, reason: "no transaction" };
  if (!wcCustomer) {
    return { ok: false, reason: "subscriptions require a WC customer — customer creation failed" };
  }

  // Step 1: parent order (the initial purchase that started the subscription).
  const parentOrder = await postWC<{ id: number }>("/wc/v3/orders", {
    status: "completed",
    currency: event.transaction.currency,
    customer_id: wcCustomer.id,
    set_paid: true,
    payment_method: event.gateway,
    payment_method_title: capitalize(event.gateway),
    transaction_id: event.transaction.gatewayTransactionId,
    billing: {
      email: event.customer.email,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    },
    line_items: lineItems,
    meta_data: gatewayMeta(event),
  } as WCOrderCreateBody);

  if (!parentOrder) return { ok: false, reason: "WC parent order create failed" };

  // Step 2: subscription record. WC Subscriptions plugin fires
  // woocommerce_subscription_payment_complete -> wpaxiom-licensing creates licenses.
  const cycle = readString(event.transaction.customData, "cycle");
  const billingPeriod: "month" | "year" = cycle === "yearly" ? "year" : "month";
  const now = new Date();
  const next = new Date(now);
  if (billingPeriod === "year") {
    next.setUTCFullYear(next.getUTCFullYear() + 1);
  } else {
    next.setUTCMonth(next.getUTCMonth() + 1);
  }

  const subscriptionLineItems: CreateSubscriptionLineItem[] = lineItems.map((li) => ({
    variation_id: li.variation_id,
    quantity: li.quantity,
    total: li.total,
  }));

  const subscriptionBody = {
    parent_id: parentOrder.id,
    customer_id: wcCustomer.id,
    status: "active" as const,
    start_date: mysqlUtc(now),
    next_payment_date: mysqlUtc(next),
    billing_period: billingPeriod,
    billing_interval: 1,
    currency: event.transaction.currency,
    payment_method: event.gateway,
    payment_method_title: capitalize(event.gateway),
    transaction_id: event.transaction.gatewayTransactionId,
    billing: {
      email: event.customer.email,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    },
    line_items: subscriptionLineItems,
    meta_data: gatewayMeta(event),
  };

  const result = await createSubscription(subscriptionBody);

  if (!result.ok) {
    console.warn(
      `[processor] subscription create failed for parent order ${parentOrder.id}: ${result.status} ${result.body}`
    );
    return {
      ok: true,
      orderId: parentOrder.id,
      customerId: wcCustomer.id,
      customerCreated,
      subscriptionError: { status: result.status, body: result.body },
    };
  }

  // WC Subscriptions doesn't fire `woocommerce_subscription_payment_complete`
  // on REST-created subscriptions, so we call the wpaxiom-licensing admin
  // endpoint explicitly. The plugin's idempotency check makes this safe.
  const licenseResult = await issueLicensesForSubscription(result.subscription.id);

  const customerName = firstName?.trim() || event.customer.email.split("@")[0];

  // For brand-new customers, send the new-user welcome email with their login
  // email + set-password link. WC's default new-account email goes through
  // wp_mail() (unreliable + off-brand), so we send our own via Resend.
  if (customerCreated) {
    await sendNewUserEmail({
      to: event.customer.email,
      customerName,
    });
  }

  // Send the license-delivery email. Non-blocking failure: if email send fails,
  // we still want the order/subscription/license to be returned as successful
  // since they're already persisted.
  if (licenseResult.ok && licenseResult.licenses.length > 0) {
    await sendLicenseDeliveryEmail({
      to: event.customer.email,
      customerName,
      license: licenseResult.licenses[0],
    });

    // Schedule the Welcome email for first-time buyers, 5 min after the
    // license email so it doesn't crowd the inbox. Existing customers (repeat
    // purchases) skip this — they already know how WPAxiom works.
    if (customerCreated) {
      await sendWelcomeEmail({
        to: event.customer.email,
        customerName,
      });
    }
  }

  return {
    ok: true,
    orderId: parentOrder.id,
    subscriptionId: result.subscription.id,
    customerId: wcCustomer.id,
    customerCreated,
    licenses: licenseResult.ok ? licenseResult.licenses : undefined,
    licenseError: licenseResult.ok
      ? undefined
      : `${licenseResult.status}: ${licenseResult.body}`,
  };
}

function gatewayMeta(event: NormalizedEvent): { key: string; value: string }[] {
  const tx = event.transaction;
  if (!tx) return [];
  return [
    { key: "_payment_gateway", value: event.gateway },
    { key: `_${event.gateway}_transaction_id`, value: tx.gatewayTransactionId },
    { key: `_${event.gateway}_customer_id`, value: event.customer.gatewayCustomerId },
    { key: `_${event.gateway}_event_id`, value: event.gatewayEventId },
    ...(tx.gatewaySubscriptionId
      ? [{ key: `_${event.gateway}_subscription_id`, value: tx.gatewaySubscriptionId }]
      : []),
  ];
}

function readString(obj: Record<string, unknown> | undefined, key: string): string | undefined {
  const v = obj?.[key];
  return typeof v === "string" ? v : undefined;
}

async function postWC<T>(path: string, body: unknown): Promise<T | null> {
  const auth = wcAuthHeader();
  if (!auth) return null;
  try {
    const res = await fetch(`${WORDPRESS_API_URL}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[processor] POST ${path} -> ${res.status}: ${text.slice(0, 300)}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.warn(`[processor] POST ${path} failed:`, e);
    return null;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ────────────────────────────────────────────────────────────────────────────
// Email triggers
// ────────────────────────────────────────────────────────────────────────────

const SITE_URL = process.env.EMAIL_BRAND_URL ?? "https://wpaxiom.com";

// TODO: derive plugin_name from the WC line item's product name. For now there
// is only one product so the hardcode is correct and avoids an extra API call.
const PLUGIN_NAME = "Axiom Blocks Pro";

// Sends the new-user welcome email for brand-new customers auto-created from a
// Paddle purchase. Tells them their login email and includes a set-password
// link (one-time password-reset key from the wpaxiom-licensing plugin).
async function sendNewUserEmail(args: {
  to: string;
  customerName: string;
}): Promise<void> {
  const link = await generatePasswordResetLink(args.to);
  if (!link) {
    console.warn(`[processor] could not generate password reset link for ${args.to}`);
    return;
  }

  const result = await sendEmail({
    to: args.to,
    template: "new-user",
    vars: {
      customer_name: args.customerName,
      login_email: link.email,
      reset_url: link.reset_url,
      expires_in_hours: link.expires_in_hours,
      dashboard_url: `${SITE_URL}/account`,
    },
  });

  if (!result.ok) {
    console.warn(`[processor] new-user email to ${args.to} failed: ${result.reason}`);
  } else {
    console.log(`[processor] new-user email sent to ${args.to} (${result.id})`);
  }
}

async function sendLicenseDeliveryEmail(args: {
  to: string;
  customerName: string;
  license: IssuedLicense;
}): Promise<void> {
  const { to, customerName, license } = args;

  const result = await sendEmail({
    to,
    template: "license-delivery",
    vars: {
      customer_name: customerName,
      plugin_name: PLUGIN_NAME,
      license_key: license.license_key,
      max_sites: license.max_activations,
      expires_at: formatExpiryDate(license.expires_at),
      download_url: `${SITE_URL}/account/downloads`,
      activation_docs_url: `${SITE_URL}/docs/activation`,
      dashboard_url: `${SITE_URL}/account/licenses`,
    },
  });

  if (!result.ok) {
    console.warn(`[processor] license delivery email to ${to} failed: ${result.reason}`);
  } else {
    console.log(`[processor] license delivery email sent to ${to} (${result.id})`);
  }
}

// Renewal Successful — fired when Paddle reports a subscription auto-renewal
// (transaction.origin === "subscription_recurring"). The customer's license
// remains valid; this email is their receipt + next-renewal heads-up.
async function sendRenewalSuccessfulEmail(args: {
  to: string;
  customerName: string;
  amount: string;
  renewalDate: string;
  nextRenewalDate: string;
  invoiceUrl: string;
}): Promise<void> {
  const result = await sendEmail({
    to: args.to,
    template: "renewal-successful",
    vars: {
      customer_name: args.customerName,
      plugin_name: PLUGIN_NAME,
      renewal_date: args.renewalDate,
      amount: args.amount,
      next_renewal_date: args.nextRenewalDate,
      invoice_url: args.invoiceUrl,
    },
  });

  if (!result.ok) {
    console.warn(`[processor] renewal-successful email to ${args.to} failed: ${result.reason}`);
  } else {
    console.log(`[processor] renewal-successful email sent to ${args.to} (${result.id})`);
  }
}

// Payment Failed (dunning) — fired when Paddle reports a failed renewal
// charge. Customer still has access until the grace period elapses; this
// nudges them to update their card.
const GRACE_PERIOD_DAYS = 7;

async function sendPaymentFailedEmail(args: {
  to: string;
  customerName: string;
  amount: string;
  retryDate: string;
}): Promise<void> {
  const result = await sendEmail({
    to: args.to,
    template: "payment-failed",
    vars: {
      customer_name: args.customerName,
      plugin_name: PLUGIN_NAME,
      amount: args.amount,
      update_payment_url: `${SITE_URL}/account/payment-method`,
      retry_date: args.retryDate,
      grace_period_days: GRACE_PERIOD_DAYS,
    },
  });

  if (!result.ok) {
    console.warn(`[processor] payment-failed email to ${args.to} failed: ${result.reason}`);
  } else {
    console.log(`[processor] payment-failed email sent to ${args.to} (${result.id})`);
  }
}

// Subscription Cancelled — fired when the customer cancels their subscription.
// Paddle keeps access until currentPeriodEnd; this email confirms the cancel
// and tells them when access ends.
async function sendSubscriptionCancelledEmail(args: {
  to: string;
  customerName: string;
  cancellationDate: string;
  accessUntilDate: string;
}): Promise<void> {
  const result = await sendEmail({
    to: args.to,
    template: "subscription-cancelled",
    vars: {
      customer_name: args.customerName,
      plugin_name: PLUGIN_NAME,
      cancellation_date: args.cancellationDate,
      access_until_date: args.accessUntilDate,
      reactivate_url: `${SITE_URL}/account/subscriptions`,
    },
  });

  if (!result.ok) {
    console.warn(`[processor] subscription-cancelled email to ${args.to} failed: ${result.reason}`);
  } else {
    console.log(`[processor] subscription-cancelled email sent to ${args.to} (${result.id})`);
  }
}

// Welcome email — fired only for first-time buyers, 5 min after license
// delivery via Resend's scheduledAt so it doesn't crowd the inbox.
async function sendWelcomeEmail(args: {
  to: string;
  customerName: string;
}): Promise<void> {
  const { to, customerName } = args;

  const result = await sendEmail({
    to,
    template: "welcome",
    scheduledAt: "in 5 min",
    vars: {
      customer_name: customerName,
      plugin_name: PLUGIN_NAME,
      docs_url: `${SITE_URL}/docs`,
      support_email: process.env.EMAIL_REPLY_TO ?? "support@wpaxiom.com",
      community_url: `${SITE_URL}/community`,
    },
  });

  if (!result.ok) {
    console.warn(`[processor] welcome email to ${to} failed: ${result.reason}`);
  } else {
    console.log(`[processor] welcome email scheduled for ${to} (${result.id})`);
  }
}

// "$59.00" / "€59.00" formatting for renewal receipts. Falls back to the
// ISO 4217 code if no symbol is known (rare for our launch currencies).
function formatAmount(amount: number, currency: string): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };
  const symbol = symbols[currency.toUpperCase()] ?? `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

function formatHumanDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Converts MySQL UTC datetime ("2027-05-12 10:24:06") to a human-friendly date
// ("May 12, 2027"). Returns "Never" if input is null/empty.
function formatExpiryDate(mysqlDate: string | null): string {
  if (!mysqlDate) return "Never";
  try {
    const iso = mysqlDate.includes("T") ? mysqlDate : mysqlDate.replace(" ", "T") + "Z";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return mysqlDate;
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return mysqlDate;
  }
}
