// Loads a template from lib/emails/templates/, extracts its Subject and
// Preheader from the HTML comment block, and substitutes {{variables}}.
//
// Templates are authored as static HTML (from Claude Design) so designers can
// edit them without touching code. The comment block at the top of each file
// follows this convention:
//
//   <!--
//     Subject:   Order {{order_number}} confirmed
//     Preheader: We received your payment. Your license will arrive in a moment.
//   -->

import { readFile } from "fs/promises";
import path from "path";

export type TemplateSlug =
  | "order-confirmation"
  | "license-delivery"
  | "welcome"
  | "renewal-upcoming"
  | "renewal-successful"
  | "payment-failed"
  | "subscription-cancelled"
  | "license-expired"
  | "site-activated"
  | "password-reset"
  | "new-user"
  | "password-changed";

const SLUG_TO_FILE: Record<TemplateSlug, string> = {
  "order-confirmation": "01-order-confirmation.html",
  "license-delivery": "02-license-delivery.html",
  welcome: "03-welcome.html",
  "renewal-upcoming": "04-renewal-upcoming.html",
  "renewal-successful": "05-renewal-successful.html",
  "payment-failed": "06-payment-failed.html",
  "subscription-cancelled": "07-subscription-cancelled.html",
  "license-expired": "08-license-expired.html",
  "site-activated": "09-site-activated.html",
  "password-reset": "10-password-reset.html",
  "new-user": "11-new-user.html",
  "password-changed": "12-password-changed.html",
};

export type RenderedEmail = {
  subject: string;
  preheader: string;
  html: string;
};

const SUBJECT_RX = /Subject:\s*(.+?)\s*$/m;
const PREHEADER_RX = /Preheader:\s*(.+?)\s*$/m;
const VAR_RX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

// Cache rendered templates per process — they're static files, no need to
// hit the disk on every send.
const templateCache = new Map<TemplateSlug, string>();

async function loadTemplate(slug: TemplateSlug): Promise<string> {
  const cached = templateCache.get(slug);
  if (cached) return cached;

  const filename = SLUG_TO_FILE[slug];
  const filepath = path.join(process.cwd(), "lib", "emails", "templates", filename);
  const raw = await readFile(filepath, "utf-8");
  templateCache.set(slug, raw);
  return raw;
}

// Vars automatically available to every template (no need to pass at call sites).
// Caller-supplied vars take precedence over these.
function autoVars(): Record<string, string | number> {
  return {
    logo_url: process.env.EMAIL_LOGO_URL ?? "https://wpaxiom.com/logo-icon.svg",
    brand_url: process.env.EMAIL_BRAND_URL ?? "https://wpaxiom.com",
    brand_name: "WPAxiom",
    support_email: process.env.EMAIL_REPLY_TO ?? "support@wpaxiom.com",
    company_address: process.env.EMAIL_COMPANY_ADDRESS ?? "wpaxiom",
    current_year: new Date().getFullYear(),
  };
}

function substitute(template: string, vars: Record<string, string | number>): string {
  return template.replace(VAR_RX, (match, name: string) => {
    if (!(name in vars)) {
      throw new Error(`[email] Missing variable "${name}" for template`);
    }
    const value = vars[name];
    return String(value);
  });
}

function extractMeta(template: string): { subject: string; preheader: string } {
  const subjectMatch = template.match(SUBJECT_RX);
  const preheaderMatch = template.match(PREHEADER_RX);
  if (!subjectMatch) {
    throw new Error("[email] Template is missing Subject: in comment block");
  }
  if (!preheaderMatch) {
    throw new Error("[email] Template is missing Preheader: in comment block");
  }
  return {
    subject: subjectMatch[1].trim(),
    preheader: preheaderMatch[1].trim(),
  };
}

export async function renderEmail(
  slug: TemplateSlug,
  vars: Record<string, string | number>
): Promise<RenderedEmail> {
  const raw = await loadTemplate(slug);
  const { subject: subjectTpl, preheader: preheaderTpl } = extractMeta(raw);

  // Merge auto-injected vars (logo_url, brand_url, etc.) with caller's vars.
  // Caller wins on conflicts.
  const allVars = { ...autoVars(), ...vars };

  // Subject and preheader may contain {{vars}} too — substitute everything.
  const subject = substitute(subjectTpl, allVars);
  const preheader = substitute(preheaderTpl, allVars);
  const html = substitute(raw, allVars);

  return { subject, preheader, html };
}
