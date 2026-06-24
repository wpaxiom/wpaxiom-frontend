# wpaxiom-frontend — CLAUDE.md

The **wpaxiom.com** storefront: marketing site, customer account dashboard, API
gateway, Paddle webhook receiver, and cron runner. It sells and documents the
WPaxiom plugins (Cartick, Specifico, Axiom Blocks). Next.js App Router.

## Stack

- **Next.js 16** (App Router, RSC) · **React 19** · **TypeScript** (strict)
- **Tailwind 3** · **lucide-react** icons · **Geist** font
- **NextAuth 5 (beta)** backed by WP JWT
- **Paddle** (Merchant of Record) via `@paddle/paddle-node-sdk`
- **Resend** transactional email · **Cloudflare R2** (`@aws-sdk/client-s3`) for plugin binaries
- **MDX** content via `next-mdx-remote` + `gray-matter`
- Deployed on **Vercel** (crons in `vercel.json`)

## Commands

```bash
npm run dev        # next dev (local)
npm run build      # next build
npm run lint       # next lint
npm run typecheck  # tsc --noEmit  ← run after TS changes
```

Path alias: `@/*` → repo root (e.g. `@/lib/wp-api`, `@/components/...`).

## The three-system architecture

| System | Host | Role |
|--------|------|------|
| **Next.js** (this repo) | wpaxiom.com | Storefront, dashboard, API gateway, webhook receiver, cron |
| **WP/WooCommerce** | api.wpaxiom.com | Source of truth: users, orders, subscriptions, licenses |
| **Paddle** | — | Merchant of Record: payments, tax, cards, billing events |

### Golden rule (do not break this)

> **Paddle fires an event → Next.js webhook receives it → WP is updated.**

Next.js never directly mutates WP subscription or license state without a Paddle
event confirming it first. Dashboard **reads** are the only exception.

📖 **`docs/system-relationships.md` is the authoritative spec** — 16 end-to-end
scenarios (login, purchase, renewal, dunning, cancel, refund, license
activation/validation, update-check, download, crons). Read it before touching
auth, billing, webhooks, licensing, or email flows. Keep it in sync with changes.

## Layout

```
app/
  page.tsx, about, contact, donate, terms, privacy-policy, refund-policy   # marketing
  plugins/{,axiom-blocks,cartick,specifico}    # plugin landing pages
  blog/[slug], changelog/[plugin], docs/[plugin]   # MDX-driven content
  login, forgot-password, reset-password
  account/{,downloads,invoices,licenses,orders,profile,subscriptions}   # dashboard (auth-gated layout)
  api/
    auth/[...nextauth] | auth/forgot-password | auth/reset-password
    account/...        # dashboard mutations (session-gated)
    webhooks/paddle    # ⭐ core mutation path; site-activated
    cron/{renewal-reminders,license-expired}   # Vercel cron, Bearer CRON_SECRET
    plugins/{update-check,download}            # WP updater + R2 signed downloads
    dev/...            # local-only debug helpers
components/ {account,auth,changelog,docs,home,layout,plugin,ui}
content/docs/{axiom-blocks,cartick,specifico}/*.mdx   # per-plugin docs
lib/   # see below
```

### `lib/` conventions

- **`wp-api.ts`** — WooCommerce REST (`/wc/v3/*`) via Consumer Key/Secret (`Basic`). WC types live here.
- **`wpaxiom-admin.ts`**, **`wpaxiom-*.ts`** — custom `wpaxiom/v1/admin/*` WP endpoints via `X-Wpaxiom-Admin-Secret`.
- **`account-*.ts`** — dashboard read models (downloads, invoices, licenses, orders, profile, subscriptions); `account-mock.ts` for local data.
- **`lmfwc-api.ts`** — License Manager for WooCommerce REST.
- **`paddle.ts` / `paddle-server.ts`** — Paddle client + server SDK (cancel, portal sessions).
- **`auth.ts`** — NextAuth config; WP JWT stored in the session cookie (7-day expiry → `session.error = "WPTokenExpired"` → redirect to login).
- **`r2.ts`** — presigned R2 URLs (60s TTL) for plugin zips.
- **`emails/`**, **`payments/`** — Resend templates and payment helpers.
- **Content/data**: `blog.ts`, `docs.ts`, `docs-nav.ts`, `changelog-data.ts`, `plugins.ts` (the `PLUGINS` catalog), `pricing.ts`, `site-data.ts`, `plugin-page-data.ts`, `wp-org.ts`.

## Environment variables

In `.env.local` (gitignored), set in Vercel for prod. Server-only unless prefixed
`NEXT_PUBLIC_` — **never expose secrets to the browser**.

- WP/WC: `WORDPRESS_API_URL`, `WC_CONSUMER_KEY/SECRET`, `JWT_AUTH_SECRET_KEY`, `LMFWC_CONSUMER_KEY/SECRET`
- WPaxiom plugin bridge: `WPAXIOM_ADMIN_SECRET`, `WPAXIOM_PLUGIN_WEBHOOK_SECRET`
- Auth: `AUTH_SECRET`
- Paddle: `PADDLE_API_KEY`, `PADDLE_NOTIFICATION_WEBHOOK_SECRET`, `PADDLE_VENDOR_ID`, `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `NEXT_PUBLIC_PADDLE_VENDOR_ID`, `NEXT_PUBLIC_PADDLE_ENV`, `PADDLE_DEV_SKIP_SIGNATURE` (local only)
- Email: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `EMAIL_LOGO_URL`, `EMAIL_BRAND_URL`
- Misc: `NEXT_PUBLIC_APP_URL`, `CRON_SECRET`

## Conventions & gotchas

- **TypeScript strict** — no `any` cop-outs; run `npm run typecheck` after changes. `allowJs` is off.
- **Server vs client** — App Router defaults to Server Components. Only add `"use client"` when needed; keep secrets/SDK calls server-side.
- **Webhook idempotency** — Paddle retries; the `/api/webhooks/paddle` handler dedupes. Preserve that when editing.
- **Cron auth** — cron routes require `Authorization: Bearer ${CRON_SECRET}`. Schedules: renewal-reminders `0 9 * * *`, license-expired `30 9 * * *` (`vercel.json`).
- **Downloads** are R2 presigned redirects (302), never streamed through Next.js.
- **Local webhook testing** uses ngrok (allowed dev origins set in `next.config.mjs`); `app/api/dev/*` are local-only helpers.
- **Content edits** are MDX in `content/`; docs nav is `lib/docs-nav.ts`, plugin catalog is `lib/plugins.ts`.

## Ecosystem siblings

- **Plugins sold here**: Cartick & Specifico (free, wordpress.org), Axiom Blocks (free + Pro).
- The **Pro plugins** (e.g. `axiom-blocks-pro`) talk to WP licensing endpoints directly for activate/validate; the update-check/download flow goes through this app's `/api/plugins/*`.
- Sibling repos live in separate local sites (Specifico plugin, axiom-blocks-pro under the `blocksuite` local site).

## Git

Per global policy, **never run git** in this repo. The user handles all commits,
branches, and pushes. Draft messages as text only.
