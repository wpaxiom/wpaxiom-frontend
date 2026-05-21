// Daily cron: send the "Renewal Upcoming" email to active WC subscriptions
// renewing in 6–8 days. Window is wide so we cover normal daily runs and tolerate
// a missed day or two.
//
// Auth: require Bearer <CRON_SECRET>. Vercel Cron sends this automatically when
// the secret is configured in the project. Manual invocation:
//
//   curl -H "Authorization: Bearer $CRON_SECRET" \
//     http://localhost:3000/api/cron/renewal-reminders
//
// Dedupe: stores `_renewal_reminder_sent_at = <next_payment_date>` on the WC
// subscription after each successful send. Subsequent runs skip subscriptions
// whose dedupe meta already matches the current next_payment_date — so the
// reminder fires at most once per billing cycle.

import { NextRequest, NextResponse } from "next/server";
import { listSubscriptions, updateSubscriptionMeta, type WCSubscriptionListItem } from "@/lib/wp-api";
import { sendEmail } from "@/lib/emails/send";

const SITE_URL = process.env.EMAIL_BRAND_URL ?? "https://wpaxiom.com";
const PLUGIN_NAME = "Axiom Blocks Pro";
const REMINDER_META_KEY = "_renewal_reminder_sent_at";

// Renewal-reminder window: 6–8 days out from "now". Anything sooner already
// missed the heads-up; anything farther we wait on.
const WINDOW_MIN_DAYS = 6;
const WINDOW_MAX_DAYS = 8;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type SendOutcome = {
  subscriptionId: number;
  email: string;
  status: "sent" | "skipped_dedupe" | "skipped_window" | "failed";
  detail?: string;
};

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const windowStart = now + WINDOW_MIN_DAYS * MS_PER_DAY;
  const windowEnd = now + WINDOW_MAX_DAYS * MS_PER_DAY;

  // Walk all active subscriptions. 50/page; stop when we get a short page.
  const outcomes: SendOutcome[] = [];
  let page = 1;
  // Safety cap so a bug or huge dataset can't hang the cron forever.
  const MAX_PAGES = 50;
  while (page <= MAX_PAGES) {
    const subs = await listSubscriptions({ status: "active", page, perPage: 50 });
    if (subs.length === 0) break;
    for (const sub of subs) {
      outcomes.push(await processSubscription(sub, windowStart, windowEnd));
    }
    if (subs.length < 50) break;
    page += 1;
  }

  const summary = {
    sent: outcomes.filter((o) => o.status === "sent").length,
    skipped_dedupe: outcomes.filter((o) => o.status === "skipped_dedupe").length,
    skipped_window: outcomes.filter((o) => o.status === "skipped_window").length,
    failed: outcomes.filter((o) => o.status === "failed").length,
    pages_scanned: page,
  };

  return NextResponse.json({ ok: true, summary, outcomes });
}

async function processSubscription(
  sub: WCSubscriptionListItem,
  windowStart: number,
  windowEnd: number
): Promise<SendOutcome> {
  const nextRaw = sub.next_payment_date_gmt;
  // GMT field is space-separated MySQL datetime ("YYYY-MM-DD HH:MM:SS") with
  // no timezone — append Z so Date parses as UTC.
  const next = new Date(
    nextRaw.includes("T") ? nextRaw + "Z" : nextRaw.replace(" ", "T") + "Z"
  );
  const nextMs = next.getTime();

  if (!Number.isFinite(nextMs)) {
    return {
      subscriptionId: sub.id,
      email: sub.billing.email,
      status: "failed",
      detail: `unparseable next_payment_date_gmt: ${nextRaw}`,
    };
  }

  if (nextMs < windowStart || nextMs > windowEnd) {
    return {
      subscriptionId: sub.id,
      email: sub.billing.email,
      status: "skipped_window",
      detail: `renews ${next.toISOString()}`,
    };
  }

  // Dedupe: skip if we already sent for this exact next_payment_date.
  const lastSent = sub.meta_data.find((m) => m.key === REMINDER_META_KEY)?.value;
  if (typeof lastSent === "string" && lastSent === nextRaw) {
    return {
      subscriptionId: sub.id,
      email: sub.billing.email,
      status: "skipped_dedupe",
    };
  }

  const customerName =
    sub.billing.first_name?.trim() || sub.billing.email.split("@")[0];

  const result = await sendEmail({
    to: sub.billing.email,
    template: "renewal-upcoming",
    vars: {
      customer_name: customerName,
      plugin_name: PLUGIN_NAME,
      renewal_date: formatHumanDate(next),
      renewal_amount: formatAmount(sub.total, sub.currency),
      // We don't track card last4 — render as "•••• ••••" so the template's
      // leading dots aren't orphaned. Improve by storing last4 on subscription
      // meta at checkout time.
      payment_method_last4: "••••",
      manage_subscription_url: `${SITE_URL}/account/subscriptions`,
    },
  });

  if (!result.ok) {
    return {
      subscriptionId: sub.id,
      email: sub.billing.email,
      status: "failed",
      detail: result.reason,
    };
  }

  // Best-effort dedupe write. If this fails the reminder might re-send on a
  // future run — annoying but not catastrophic.
  await updateSubscriptionMeta(sub.id, [
    { key: REMINDER_META_KEY, value: nextRaw },
  ]);

  return { subscriptionId: sub.id, email: sub.billing.email, status: "sent" };
}

function formatHumanDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(totalString: string, currency: string): string {
  const amount = parseFloat(totalString);
  const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };
  const symbol = symbols[currency.toUpperCase()] ?? `${currency} `;
  return `${symbol}${Number.isFinite(amount) ? amount.toFixed(2) : totalString}`;
}
