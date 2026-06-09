# System Relationships — Next.js · WP/WC · Paddle

> Generated 2026-06-06

---

## System roles

| System | Role |
|--------|------|
| **Next.js** (wpaxiom.com) | Storefront, account dashboard, API gateway, webhook receiver, cron runner |
| **WP/WC** (api.wpaxiom.com) | Source of truth for users, orders, subscriptions, licenses |
| **Paddle** | Merchant of Record — collects money, handles tax, stores cards, fires billing events |

---

## Auth tokens in play

| Token | Direction | Used for |
|-------|-----------|----------|
| WP JWT | Next.js → WP | Customer-facing calls (`Bearer`). Stored in NextAuth session cookie. |
| WC Consumer Key/Secret | Next.js → WP | Admin WC REST calls (`Basic`). Env var only, never in browser. |
| `WPAXIOM_ADMIN_SECRET` | Next.js → WP | `wpaxiom/v1/admin/*` calls (`X-Wpaxiom-Admin-Secret`). |
| `WPAXIOM_PLUGIN_WEBHOOK_SECRET` | WP plugin → Next.js | WP plugin fires webhooks to Next.js (`Bearer`). |
| `PADDLE_NOTIFICATION_WEBHOOK_SECRET` | Paddle → Next.js | Verifies Paddle webhook signatures. |
| `PADDLE_API_KEY` | Next.js → Paddle | Server-side Paddle SDK (cancel, portal sessions). |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Browser → Paddle.js | Opens checkout overlay. |

---

## Scenario 1 — Login

```
Browser → POST /api/auth/[...nextauth]
  → Next.js → POST /jwt-auth/v1/token (WP)
  ← WP returns { token, user_email, user_display_name }
  → NextAuth stores JWT (wpToken) in encrypted session cookie
```

WP JWT expires after 7 days (WP default). Next.js detects expiry via the decoded `exp` claim
and sets `session.error = "WPTokenExpired"` → account layout redirects to login.

---

## Scenario 2 — Forgot / reset password

```
Browser → POST /api/auth/forgot-password
  → Next.js → POST /wpaxiom/v1/admin/password-reset (X-Wpaxiom-Admin-Secret)
  ← WP generates one-time reset key, returns { reset_url, expires_in_hours }
  → Next.js → Resend sends reset email with link

Browser clicks reset link → POST /api/auth/reset-password (key + new password)
  → Next.js → POST /wpaxiom/v1/admin/password-reset-complete
  ← WP validates key, sets new password
```

---

## Scenario 3 — New subscription purchase

```
Browser → Paddle.js overlay (NEXT_PUBLIC_PADDLE_CLIENT_TOKEN)
  → Customer pays on Paddle (card stored by Paddle, tax calculated by Paddle)
  ← Paddle fires: transaction.completed (webhook)

Paddle → POST /api/webhooks/paddle
  → Next.js verifies signature (PADDLE_NOTIFICATION_WEBHOOK_SECRET)
  → Idempotency check (in-memory, dedupes Paddle retries)

  → GET /wc/v3/customers?email=... (Consumer Key)
    ← customer found  OR
  → POST /wc/v3/customers (Consumer Key)  ← new customer created

  → POST /wc/v3/orders (Consumer Key)  ← parent order created (status=completed)

  → POST /wc/v3/subscriptions (Consumer Key)  ← subscription created
      stores meta: _paddle_customer_id, _paddle_subscription_id, _paddle_transaction_id

  → POST /wpaxiom/v1/admin/licenses/issue (Admin Secret)
      WP creates license row, sets expires_at = now + 1 year
    ← returns [ { license_key, max_activations, expires_at, ... } ]

  [if new customer]
  → POST /wpaxiom/v1/admin/password-reset (Admin Secret)
    ← WP returns one-time reset URL
  → Resend: new-user email (login email + set-password link)

  → Resend: license-delivery email (license key, download link)

  [if new customer]
  → Resend: welcome email (scheduled +5 min via Resend)

Browser ← checkout.completed event → redirect to /account/licenses?welcome=1
```

---

## Scenario 4 — Auto-renewal (Paddle billing date)

```
Paddle → POST /api/webhooks/paddle
  event: transaction.completed, origin=subscription_recurring

  → GET /wc/v3/subscriptions?customer=... (Consumer Key)
    find WC sub matching _paddle_subscription_id

  → POST /wpaxiom/v1/admin/subscriptions/process-renewal (Admin Secret)
      { subscription_id, transaction_id }
    ← WP: creates renewal order + updates next_payment_date + extends license expires_at
    ← returns { renewal_order_id, next_payment (MySQL UTC) }

  → Resend: renewal-successful email
      (amount, renewal date, next renewal date from WP response)
```

---

## Scenario 5 — Payment failed (dunning)

```
Paddle → POST /api/webhooks/paddle
  event: transaction.payment_failed

  → Resend: payment-failed email
      (amount, retry estimate = occurredAt + 3 days)

[Paddle retries automatically over ~2 weeks]

  If retry succeeds  → Scenario 4 (renewal)
  If all retries fail → Scenario 6 (cancellation)
```

Customer can update their card via "Manage billing" → Scenario 8.

---

## Scenario 6 — Customer cancels (from account dashboard)

```
Browser → POST /api/account/subscriptions/{wcSubId}/cancel
  → Next.js auth check (session)
  → GET /wc/v3/subscriptions/{wcSubId} (Consumer Key)  ← ownership check
  → Paddle SDK: subscriptions.cancel(paddleSubId, { effectiveFrom: "next_billing_period" })
  ← Paddle schedules cancellation for end of billing period

[At period end, Paddle fires subscription.cancelled]

Paddle → POST /api/webhooks/paddle
  event: subscription.cancelled

  → GET /wc/v3/customers?email=... (Consumer Key)
  → GET /wc/v3/subscriptions?customer=...  ← find by _paddle_subscription_id
  → PUT /wc/v3/subscriptions/{id} { status: "cancelled" } (Consumer Key)
      WP hook: woocommerce_subscription_status_cancelled → license set to cancelled

  → Resend: subscription-cancelled email (access_until = currentPeriodEnd)
```

Customer retains access until period end. Subscriptions page shows "Cancelled" badge
+ Resubscribe button after the webhook fires at period end.

---

## Scenario 7 — Subscription status changes (pause, reactivation, etc.)

```
Paddle → POST /api/webhooks/paddle
  event: subscription.updated

  → GET /wc/v3/customers?email=... (Consumer Key)
  → GET /wc/v3/subscriptions?customer=...  ← find by _paddle_subscription_id
  → PUT /wc/v3/subscriptions/{id} { status, next_payment_date } (Consumer Key)
```

Status mapping:

| Paddle status | WC status |
|---------------|-----------|
| active / trialing | active |
| paused / past_due | on-hold |
| cancelled | cancelled |

---

## Scenario 8 — Manage billing (card update, invoice PDF, etc.)

```
Browser → POST /api/account/subscriptions/portal
  → Next.js auth check (session)
  → GET /wc/v3/customers?email=... (Consumer Key)
  → GET /wc/v3/subscriptions?customer=... (Consumer Key)
      extract _paddle_customer_id + _paddle_subscription_id from meta
  → Paddle SDK: customerPortalSessions.create(paddleCustomerId, [paddleSubIds])
  ← returns { urls.general.overview }  (one-time authenticated URL)

Browser → window.open(portalUrl) → Paddle's hosted portal
  Customer updates card / downloads invoices / manages subscription on Paddle
  Any changes flow back via subscription.updated or subscription.cancelled webhooks
```

---

## Scenario 9 — Refund (admin-initiated in Paddle dashboard)

```
Paddle → POST /api/webhooks/paddle
  event: refund.issued

  → POST /wpaxiom/v1/admin/subscriptions/refund (Admin Secret)
      { transaction_id }
    ← WP finds order by _paddle_transaction_id meta, marks it refunded
```

---

## Scenario 10 — License site activation (from customer's WP site with Pro plugin)

```
Customer's WP site → POST /wpaxiom/v1/license/activate
  (no auth — license_key IS the credential)
  ← WP: creates activation row, enforces max_activations limit
  ← returns { ok, current_activations, max_activations, expires_at }

  WP plugin fires site-activated webhook:
  WP → POST /api/webhooks/site-activated (WPAXIOM_PLUGIN_WEBHOOK_SECRET)
    → Resend: site-activated email (site URL, slots used / max)
```

---

## Scenario 11 — License validation (ongoing, from Pro plugin on every WP request)

```
Customer's WP site → POST /wpaxiom/v1/license/validate
  { license_key, site_url }
  ← WP: checks license status + activation exists + not expired
  ← returns { valid: true/false }
```

No Next.js involvement — Pro plugin talks to WP directly.

---

## Scenario 12 — Plugin update check (WordPress update mechanism)

```
Customer's WP site → GET /api/plugins/update-check
  ?license_key=...&site_url=...&plugin=axiom-blocks-pro&version=1.x.x

  → Next.js → POST /wpaxiom/v1/license/validate (WP)  ← validate license
  → Next.js → R2: read versions.json  ← get latest version

  ← returns { new_version, package: "/api/plugins/download?..." or "" if up to date }
```

---

## Scenario 13 — Plugin download

```
[From account page]
Browser → GET /api/account/download
  → Next.js auth check (session + wpToken)
  → R2: generate presigned URL (60s TTL)
  ← 302 redirect to R2 presigned URL → browser downloads zip

[From WordPress updater, after update-check]
Customer's WP site → GET /api/plugins/download
  ?license_key=...&site_url=...&plugin=...
  → Next.js → POST /wpaxiom/v1/license/validate (WP)
  → R2: generate presigned URL (60s TTL)
  ← 302 redirect → WP downloads zip from R2 directly
```

---

## Scenario 14 — Renewal reminder cron (daily)

```
Vercel Cron → GET /api/cron/renewal-reminders (Bearer CRON_SECRET)
  → GET /wc/v3/subscriptions?status=active (Consumer Key, paginated 50/page)
  For each subscription renewing in 6–8 days:
    check _renewal_reminder_sent_at meta  ← dedupe, skip if already sent this cycle
    → Resend: renewal-upcoming email
    → PUT /wc/v3/subscriptions/{id} (Consumer Key)  ← write dedupe meta
```

---

## Scenario 15 — License expired cron (daily)

```
Vercel Cron → GET /api/cron/license-expired (Bearer CRON_SECRET)
  → GET /wpaxiom/v1/admin/licenses/expired-recently?hours=24 (Admin Secret)
  For each expired license:
    → Resend: license-expired email (reactivate link → pricing page)
```

---

## Scenario 16 — Profile updates

```
[Name / email]
Browser → PATCH /api/account/profile/details
  → PATCH /wp/v2/users/me (Bearer JWT)  ← WP updates user record

[Billing address]
Browser → PATCH /api/account/profile/billing
  → GET /wc/v3/customers?email=...  ← find WC customer ID
  → PUT /wc/v3/customers/{id} (Consumer Key)  ← update billing address

[Password]
Browser → POST /api/account/profile/password
  → WP endpoint (Bearer JWT)
```

---

## Data ownership summary

| Data | Owned by | Notes |
|------|----------|-------|
| Card / payment method | Paddle | Never touches Next.js or WP |
| Tax calculation + receipts | Paddle | Paddle is MoR |
| Orders | WP/WC | Created by Next.js webhook processor |
| Subscriptions | WP/WC | Status synced from Paddle via webhooks |
| Licenses | WP (wpaxiom-licensing) | Status driven by WC subscription hooks |
| Site activations | WP (wpaxiom-licensing) | Enforces max_activations |
| Plugin binaries | Cloudflare R2 | Served via signed URLs, 60s TTL |
| Transactional emails | Resend | Triggered by Next.js only |
| Session / auth cookie | Next.js (NextAuth) | Backed by WP JWT |

---

## Golden rule

> **Paddle fires an event → Next.js webhook receives it → WP is updated.**

Next.js never directly mutates WP subscription or license state without a Paddle event
confirming it first. Reads for the account dashboard are the only exception.
