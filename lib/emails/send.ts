// Email send dispatcher. Renders the template, then hands the payload to the
// configured transport. Transport is pluggable — Resend today, swap-friendly
// for Postmark / SES later without touching call sites.

import { Resend } from "resend";
import { renderEmail, type TemplateSlug } from "./render";
import type {
  LicenseDeliveryVars,
  OrderConfirmationVars,
  WelcomeVars,
  RenewalUpcomingVars,
  RenewalSuccessfulVars,
  PaymentFailedVars,
  SubscriptionCancelledVars,
  LicenseExpiredVars,
  SiteActivatedVars,
  PasswordResetVars,
  NewUserVars,
  PasswordChangedVars,
} from "./types";

// Per-template var typing — picks the right shape based on the slug.
type VarsFor<S extends TemplateSlug> =
  S extends "order-confirmation" ? OrderConfirmationVars :
  S extends "license-delivery" ? LicenseDeliveryVars :
  S extends "welcome" ? WelcomeVars :
  S extends "renewal-upcoming" ? RenewalUpcomingVars :
  S extends "renewal-successful" ? RenewalSuccessfulVars :
  S extends "payment-failed" ? PaymentFailedVars :
  S extends "subscription-cancelled" ? SubscriptionCancelledVars :
  S extends "license-expired" ? LicenseExpiredVars :
  S extends "site-activated" ? SiteActivatedVars :
  S extends "password-reset" ? PasswordResetVars :
  S extends "new-user" ? NewUserVars :
  S extends "password-changed" ? PasswordChangedVars :
  never;

export type SendEmailOptions<S extends TemplateSlug> = {
  to: string;
  template: S;
  vars: VarsFor<S>;
  // Optional: override the default From address per send (rare).
  from?: string;
  // Optional: reply-to override.
  replyTo?: string;
  // Optional: delay delivery. Accepts Resend's natural-language ("in 5 min",
  // "tomorrow at 9am") or ISO 8601. Used for the Welcome email (5 min after
  // license delivery) so it lands after the license email, not at the same time.
  scheduledAt?: string;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: string };

const FROM_DEFAULT = process.env.EMAIL_FROM ?? "WPAxiom <noreply@wpaxiom.com>";
const REPLY_TO_DEFAULT = process.env.EMAIL_REPLY_TO ?? "support@wpaxiom.com";

export async function sendEmail<S extends TemplateSlug>(
  options: SendEmailOptions<S>
): Promise<SendEmailResult> {
  let rendered;
  try {
    rendered = await renderEmail(
      options.template,
      options.vars as unknown as Record<string, string | number>
    );
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  }

  const transport = getTransport();
  return transport({
    to: options.to,
    from: options.from ?? FROM_DEFAULT,
    replyTo: options.replyTo ?? REPLY_TO_DEFAULT,
    subject: rendered.subject,
    html: rendered.html,
    scheduledAt: options.scheduledAt,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Transport
// ────────────────────────────────────────────────────────────────────────────

type Transport = (payload: {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  html: string;
  scheduledAt?: string;
}) => Promise<SendEmailResult>;

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (resendInstance) return resendInstance;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  resendInstance = new Resend(apiKey);
  return resendInstance;
}

function getTransport(): Transport {
  const resend = getResend();

  // Dev fallback when RESEND_API_KEY isn't set — keeps local development
  // unblocked. In production this should never trigger.
  if (!resend) {
    return async (payload) => {
      const when = payload.scheduledAt ? ` (scheduled: ${payload.scheduledAt})` : "";
      console.warn(
        `[email/dev] RESEND_API_KEY not set — would send "${payload.subject}" to ${payload.to}${when}`
      );
      return { ok: true, id: `dev_${Date.now()}` };
    };
  }

  return async (payload) => {
    try {
      const result = await resend.emails.send({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        replyTo: payload.replyTo,
        scheduledAt: payload.scheduledAt,
      });
      if (result.error) {
        const msg = `${result.error.name}: ${result.error.message}`;
        console.warn(`[email/resend] send failed: ${msg}`);
        return { ok: false, reason: msg };
      }
      const id = result.data?.id ?? "unknown";
      console.log(`[email/resend] sent "${payload.subject}" to ${payload.to} (${id})`);
      return { ok: true, id };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`[email/resend] exception: ${msg}`);
      return { ok: false, reason: msg };
    }
  };
}
