// DEV-ONLY endpoint. Sends any template to a given email address with sample
// data, so you can iterate on copy / design without triggering full payment
// flows. Refuses to run in production.
//
// Usage:
//   curl -X POST http://localhost:3000/api/dev/send-email \
//     -H "Content-Type: application/json" \
//     -d '{"to": "you@example.com", "template": "license-delivery"}'

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emails/send";
import type { TemplateSlug } from "@/lib/emails/render";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Dev-only endpoint" }, { status: 404 });
  }

  let body: { to?: string; template?: TemplateSlug; vars?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.to || !body.template) {
    return NextResponse.json(
      { error: "Missing required fields: to, template" },
      { status: 400 }
    );
  }

  const sampleVars = body.vars ?? SAMPLE_VARS[body.template];
  if (!sampleVars) {
    return NextResponse.json(
      { error: `Unknown template "${body.template}"` },
      { status: 400 }
    );
  }

  // Cast through unknown because each template has different vars — TS can't
  // narrow from a dynamic string at runtime, but the renderEmail call inside
  // sendEmail validates variable presence anyway.
  const result = await sendEmail({
    to: body.to,
    template: body.template,
    vars: sampleVars as never,
  });

  return NextResponse.json(result);
}

// Sample data per template, so quick tests don't need to pass full vars.
const SAMPLE_VARS: Record<TemplateSlug, Record<string, string | number>> = {
  "order-confirmation": {
    customer_name: "Faisal",
    order_number: "WPX-000123",
    order_date: "May 12, 2026",
    plan_name: "Axiom Blocks Pro — 5 Sites",
    plan_cycle: "Yearly",
    order_total: "$119.00",
    billing_email: "faisal@example.com",
    view_order_url: "https://wpaxiom.com/account/orders/123",
  },
  "license-delivery": {
    customer_name: "Faisal",
    plugin_name: "Axiom Blocks Pro",
    license_key: "AXM-D045-8C3F-197D-B79A",
    max_sites: 5,
    expires_at: "May 12, 2027",
    download_url: "https://wpaxiom.com/account/downloads",
    activation_docs_url: "https://wpaxiom.com/docs/activation",
    dashboard_url: "https://wpaxiom.com/account/licenses",
  },
  welcome: {
    customer_name: "Faisal",
    plugin_name: "Axiom Blocks Pro",
    docs_url: "https://wpaxiom.com/docs",
    support_email: "support@wpaxiom.com",
    community_url: "https://wpaxiom.com/community",
  },
  "renewal-upcoming": {
    customer_name: "Faisal",
    plugin_name: "Axiom Blocks Pro",
    renewal_date: "May 19, 2027",
    renewal_amount: "$119.00",
    payment_method_last4: "4242",
    manage_subscription_url: "https://wpaxiom.com/account/subscriptions",
  },
  "renewal-successful": {
    customer_name: "Faisal",
    plugin_name: "Axiom Blocks Pro",
    renewal_date: "May 19, 2027",
    amount: "$119.00",
    next_renewal_date: "May 19, 2028",
    invoice_url: "https://wpaxiom.com/account/invoices/124",
  },
  "payment-failed": {
    customer_name: "Faisal",
    plugin_name: "Axiom Blocks Pro",
    amount: "$119.00",
    update_payment_url: "https://wpaxiom.com/account/payment-method",
    retry_date: "May 14, 2027",
    grace_period_days: 7,
  },
  "subscription-cancelled": {
    customer_name: "Faisal",
    plugin_name: "Axiom Blocks Pro",
    cancellation_date: "May 12, 2026",
    access_until_date: "May 12, 2027",
    reactivate_url: "https://wpaxiom.com/account/subscriptions",
  },
  "license-expired": {
    customer_name: "Faisal",
    plugin_name: "Axiom Blocks Pro",
    expired_on: "May 12, 2027",
    reactivate_url: "https://wpaxiom.com/plugins/axiom-blocks/pricing",
  },
  "site-activated": {
    customer_name: "Faisal",
    plugin_name: "Axiom Blocks Pro",
    site_url: "https://example-customer.com",
    activated_at: "May 12, 2026 at 10:24 UTC",
    current_sites: 2,
    max_sites: 5,
    manage_sites_url: "https://wpaxiom.com/account/licenses",
  },
  "password-reset": {
    customer_name: "Faisal",
    reset_url: "https://wpaxiom.com/reset-password?token=xxx",
    request_ip: "203.0.113.10",
    expires_in_hours: 2,
  },
  "new-user": {
    customer_name: "Faisal",
    login_email: "faisal@example.com",
    reset_url: "https://wpaxiom.com/reset-password?token=xxx",
    expires_in_hours: 24,
    dashboard_url: "https://wpaxiom.com/account",
  },
  "password-changed": {
    customer_name: "Faisal",
    changed_at: "May 13, 2026 at 4:12 PM UTC",
    request_ip: "203.0.113.10",
    login_url: "https://wpaxiom.com/login",
  },
};
