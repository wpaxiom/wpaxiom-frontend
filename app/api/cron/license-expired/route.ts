// Daily cron: send the "License Expired" email for licenses whose expires_at
// fell within the last 24h. Window matches the daily schedule — if the cron
// misses a run, expirations from that day won't be re-caught (TODO: add a
// dedupe meta column on wpaxiom_licenses so we can widen the window safely).
//
// Auth: Bearer <CRON_SECRET>.

import { NextRequest, NextResponse } from "next/server";
import { listRecentlyExpiredLicenses, type RecentlyExpiredLicense } from "@/lib/wpaxiom-admin";
import { sendEmail } from "@/lib/emails/send";

const SITE_URL = process.env.EMAIL_BRAND_URL ?? "https://wpaxiom.com";
const PLUGIN_NAME = "Axiom Blocks Pro";

type Outcome = {
  licenseId: number;
  email: string;
  status: "sent" | "failed";
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

  const licenses = await listRecentlyExpiredLicenses(24);
  const outcomes: Outcome[] = [];
  for (const license of licenses) {
    outcomes.push(await processLicense(license));
  }

  return NextResponse.json({
    ok: true,
    summary: {
      total: outcomes.length,
      sent: outcomes.filter((o) => o.status === "sent").length,
      failed: outcomes.filter((o) => o.status === "failed").length,
    },
    outcomes,
  });
}

async function processLicense(license: RecentlyExpiredLicense): Promise<Outcome> {
  const result = await sendEmail({
    to: license.customer_email,
    template: "license-expired",
    vars: {
      customer_name: license.customer_name || license.customer_email.split("@")[0],
      plugin_name: PLUGIN_NAME,
      expired_on: formatHumanDate(parseMysqlUtc(license.expires_at)),
      reactivate_url: `${SITE_URL}/plugins/axiom-blocks/pricing`,
    },
  });

  if (!result.ok) {
    return {
      licenseId: license.id,
      email: license.customer_email,
      status: "failed",
      detail: result.reason,
    };
  }
  return { licenseId: license.id, email: license.customer_email, status: "sent" };
}

function parseMysqlUtc(mysql: string): Date {
  return new Date(mysql.includes("T") ? mysql + "Z" : mysql.replace(" ", "T") + "Z");
}

function formatHumanDate(d: Date): string {
  if (Number.isNaN(d.getTime())) return "recently";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
