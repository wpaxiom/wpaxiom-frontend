// Browser-facing endpoint that the /reset-password form POSTs to. Validates
// inputs, then calls the wpaxiom admin endpoint (with the admin secret) to
// actually verify the key and set the password.
//
// Keeping the admin secret server-side means the browser never sees it — only
// this Node-side handler does.

import { NextRequest, NextResponse } from "next/server";
import { completePasswordReset } from "@/lib/wpaxiom-admin";
import { sendEmail } from "@/lib/emails/send";

const SITE_URL = process.env.EMAIL_BRAND_URL ?? "https://wpaxiom.com";

export async function POST(request: NextRequest) {
  let body: { key?: string; login?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const key = body.key?.trim() ?? "";
  const login = body.login?.trim() ?? "";
  const password = body.password ?? "";

  if (!key || !login || !password) {
    return NextResponse.json(
      { error: "Missing key, login, or password" },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const result = await completePasswordReset({ key, login, password });

  if (!result.ok) {
    // Generic messaging for invalid/expired keys (don't leak details). Surface
    // server-side reasons (missing secret, network errors) as 500 so users see
    // a sensible "try again" message.
    if (result.code === "invalid_key" || result.code === "weak_password") {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    console.warn(
      `[reset-password] complete failed: ${result.status} ${result.code} ${result.message}`
    );
    return NextResponse.json(
      { error: "Could not reset password. Please request a new link." },
      { status: 500 }
    );
  }

  // Fire-and-forget confirmation email so the response stays fast and a Resend
  // outage doesn't block the password change from succeeding.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  void sendPasswordChangedEmail(result.email, ip).catch((e) => {
    console.warn("[reset-password] confirmation email failed:", e);
  });

  return NextResponse.json({ ok: true, email: result.email });
}

async function sendPasswordChangedEmail(email: string, requestIp: string): Promise<void> {
  const changedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";

  const sendResult = await sendEmail({
    to: email,
    template: "password-changed",
    vars: {
      customer_name: email.split("@")[0],
      changed_at: changedAt,
      request_ip: requestIp,
      login_url: `${SITE_URL}/login`,
    },
  });

  if (!sendResult.ok) {
    console.warn(`[reset-password] password-changed email to ${email} failed: ${sendResult.reason}`);
  } else {
    console.log(`[reset-password] password-changed email sent to ${email} (${sendResult.id})`);
  }
}
