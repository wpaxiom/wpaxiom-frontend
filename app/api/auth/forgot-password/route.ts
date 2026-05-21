// Forgot-password endpoint. Takes an email, looks up the user via the wpaxiom
// admin endpoint, sends a password-reset email if the user exists.
//
// Security note: this endpoint ALWAYS returns success, regardless of whether
// the email is registered. This prevents email-enumeration attacks (where an
// attacker probes which emails have accounts on your site).

import { NextRequest, NextResponse } from "next/server";
import { generatePasswordResetLink } from "@/lib/wpaxiom-admin";
import { sendEmail } from "@/lib/emails/send";

export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Fire-and-forget the actual work so the response is fast regardless of
  // whether the email exists. Constant-time response = no enumeration leak.
  void handleResetRequest(email, request).catch((e) => {
    console.warn("[forgot-password] handler failed:", e);
  });

  return NextResponse.json({
    ok: true,
    message:
      "If an account with that email exists, we just sent a password reset link.",
  });
}

async function handleResetRequest(email: string, request: NextRequest): Promise<void> {
  const link = await generatePasswordResetLink(email);
  if (!link) {
    // User doesn't exist (or admin endpoint failed). Stay silent — see security
    // note above.
    console.log(`[forgot-password] no user for ${email} (or admin endpoint unreachable)`);
    return;
  }

  // Best-effort IP capture from common headers (ngrok, Vercel, Cloudflare).
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const customerName = email.split("@")[0];

  const result = await sendEmail({
    to: email,
    template: "password-reset",
    vars: {
      customer_name: customerName,
      reset_url: link.reset_url,
      request_ip: ip,
      expires_in_hours: link.expires_in_hours,
    },
  });

  if (!result.ok) {
    console.warn(`[forgot-password] email send failed for ${email}: ${result.reason}`);
  } else {
    console.log(`[forgot-password] email sent to ${email} (${result.id})`);
  }
}
