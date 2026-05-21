// Receives the site-activated webhook from the wpaxiom-licensing WP plugin.
// Plugin fires this fire-and-forget from inside `/license/activate` whenever
// a brand-new activation row is inserted (not on re-validation pings).
//
// Auth: Bearer WPAXIOM_PLUGIN_WEBHOOK_SECRET — same secret on both ends. The
// plugin sends the secret as a Bearer token, no body signature. This endpoint
// is server-to-server (plugin → Next.js), never browser-facing.

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emails/send";

const SITE_URL = process.env.EMAIL_BRAND_URL ?? "https://wpaxiom.com";
const PLUGIN_NAME = "Axiom Blocks Pro";

type SiteActivatedPayload = {
  license_key?: string;
  site_url?: string;
  activated_at?: string; // MySQL UTC datetime
  current_activations?: number;
  max_activations?: number;
  product_id?: number;
  customer_email?: string;
  customer_name?: string;
};

export async function POST(request: NextRequest) {
  const secret = process.env.WPAXIOM_PLUGIN_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "WPAXIOM_PLUGIN_WEBHOOK_SECRET not configured" },
      { status: 500 }
    );
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SiteActivatedPayload;
  try {
    body = (await request.json()) as SiteActivatedPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.customer_email || !body.site_url) {
    return NextResponse.json(
      { error: "customer_email and site_url required" },
      { status: 400 }
    );
  }

  const result = await sendEmail({
    to: body.customer_email,
    template: "site-activated",
    vars: {
      customer_name:
        body.customer_name?.trim() || body.customer_email.split("@")[0],
      plugin_name: PLUGIN_NAME,
      site_url: body.site_url,
      activated_at: formatActivatedAt(body.activated_at),
      current_sites: body.current_activations ?? 1,
      max_sites: body.max_activations ?? 1,
      manage_sites_url: `${SITE_URL}/account/licenses`,
    },
  });

  if (!result.ok) {
    console.warn(`[site-activated] email send failed: ${result.reason}`);
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: result.id });
}

function formatActivatedAt(mysql?: string): string {
  if (!mysql) return "just now";
  const d = new Date(mysql.includes("T") ? mysql + "Z" : mysql.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return "just now";
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }) + " UTC";
}
