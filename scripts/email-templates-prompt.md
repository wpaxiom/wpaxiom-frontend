# Email Templates — Claude Design Prompt

Paste the prompt below into Claude Design (or any new conversation) to generate all 10 transactional email templates in one shot. Don't trim the brand/constraint sections — they keep the templates consistent.

---

Create a complete set of transactional email templates for wpaxiom — a WordPress plugin marketplace that sells Axiom Blocks Pro (a WordPress block library plugin).

## Brand system (use these exact tokens)

Colors (use hex literally — no Tailwind, emails need static CSS):

- Brand coral: `#e8593c` (primary CTA, accents, link color)
- Coral hover: `#d4492e`
- Coral subtle bg: `rgba(232, 89, 60, 0.08)`
- Coral border: `rgba(232, 89, 60, 0.25)`
- Ink (heading text): `#0f0f0f`
- Body text: `#404040`
- Muted text: `#666666`
- Subtle text: `#999999`
- Background: `#ffffff`
- Surface: `#f8f8f8`
- Elevated: `#f0f0f0`
- Border line: `#e5e5e5`
- Success (green): `#16a34a`
- Warning (amber): `#ca8a04`
- Error (red): `#dc2626`

Typography:

- Body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- Mono: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`
- Use mono for: labels (`// THIS STYLE`), license keys, order numbers, code snippets
- Headings: semibold, tight letter-spacing (`-0.01em`), ink color

Voice & tone:

- Technical, calm, confident. No exclamation marks. No marketing fluff.
- Lead with the fact, then the action. Short paragraphs.
- Inspired by Linear / Vercel / Stripe transactional emails.

## Visual conventions

- Container: 600px max width, centered, white background, no shadow
- Header: small wpaxiom logo/wordmark (use a placeholder for now), aligned left
- Section pattern: small mono uppercase label in muted gray (e.g., `// ORDER`), then a clear ink heading, then body copy in `#404040`
- Coral for: primary CTA buttons, license-key chip background, important accents
- License key block: monospace, large, generous padding, coral subtle bg with coral border — must be visually unmistakable as the takeaway
- Buttons: solid coral background, white text, 12px vertical / 24px horizontal padding, 6px border-radius, 14px font, semibold
- Dividers: 1px solid `#e5e5e5` with 32px vertical margin
- Footer: muted text, small, with unsubscribe link (where applicable), company address placeholder, support email (`support@wpaxiom.com`)

## Email-safe HTML constraints

- Table-based layout for max compatibility (Gmail, Outlook desktop, Apple Mail)
- ALL styles inline (no `<style>` blocks except for media queries)
- No background images, no web fonts, no flexbox/grid
- Use `<table role="presentation">` for layout
- Include preheader text (hidden span at top, 0px height)
- Responsive via `@media (max-width: 600px)` — collapse to single column on mobile

## Templates to produce (give me each as separate HTML, fully styled inline)

Use `{{double_curly}}` for variables. Each template needs:

- Subject line (preheader)
- Preheader (40–90 char preview text)
- Full HTML body

### 1. Order Confirmation

- **Sent:** right after purchase, before license is issued (~30s window)
- **Vars:** `customer_name`, `order_number`, `order_date`, `plan_name`, `plan_cycle`, `order_total`, `billing_email`, `view_order_url`
- **Goal:** confirm payment was received, set expectation that license arrives shortly

### 2. License Delivery (most important — make this one shine)

- **Sent:** immediately after license is generated
- **Vars:** `customer_name`, `plugin_name`, `license_key`, `max_sites`, `expires_at`, `download_url`, `activation_docs_url`, `dashboard_url`
- **Goal:** deliver the license key prominently, explain how to activate
- **Must include:** the license key in a large, copy-friendly block; download button; "next steps" list (download → upload to WP → activate license)

### 3. Welcome (first-time buyer only)

- **Sent:** 5 minutes after license delivery
- **Vars:** `customer_name`, `plugin_name`, `docs_url`, `support_email`, `community_url`
- **Goal:** warm onboarding, point to docs and support; no sales pitch

### 4. Renewal Upcoming

- **Sent:** 7 days before subscription renews
- **Vars:** `customer_name`, `plugin_name`, `renewal_date`, `renewal_amount`, `payment_method_last4`, `manage_subscription_url`
- **Goal:** heads-up about upcoming charge; reassuring tone

### 5. Renewal Successful

- **Vars:** `customer_name`, `plugin_name`, `renewal_date`, `amount`, `next_renewal_date`, `invoice_url`
- **Goal:** receipt for successful renewal

### 6. Payment Failed (dunning)

- **Sent:** when Paddle reports a failed renewal payment
- **Vars:** `customer_name`, `plugin_name`, `amount`, `update_payment_url`, `retry_date`, `grace_period_days`
- **Goal:** calm urgency. Explain card declined, request update, note that license continues for `grace_period_days`

### 7. Subscription Cancelled (user-initiated)

- **Vars:** `customer_name`, `plugin_name`, `cancellation_date`, `access_until_date`, `reactivate_url`
- **Goal:** confirm cancellation, note access continues until `access_until_date`

### 8. License Expired

- **Sent:** when license `expires_at` passes without renewal
- **Vars:** `customer_name`, `plugin_name`, `expired_on`, `reactivate_url`
- **Goal:** notify that license is now expired, offer reactivation; no guilt-trip

### 9. Site Activated

- **Sent:** when a new site activates the license
- **Vars:** `customer_name`, `plugin_name`, `site_url`, `activated_at`, `current_sites`, `max_sites`, `manage_sites_url`
- **Goal:** security/notification — let them know an activation happened on their key

### 10. Password Reset

- **Vars:** `customer_name`, `reset_url`, `request_ip`, `expires_in_hours`
- **Goal:** standard password reset, in our visual style

## Deliverable

Return all 10 templates as complete HTML strings, one after another, with a clear `## Template N: NAME` heading separator. Don't abbreviate or use placeholders like `...(repeat structure)...` — I need each one in full so I can paste them into the codebase. Match the visual identity precisely across all 10. Include the subject line and preheader for each.

Start with template 2 (License Delivery) as the hero — design that one carefully, then derive the others from its structure.
