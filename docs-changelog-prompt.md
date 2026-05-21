# Claude Design brief — Docs & Changelog

Design three new HTML pages for the wpaxiom marketing site, matching the existing dark-theme style (coral `#E8593C` accent, Geist font, 1280px container, sticky navbar with backdrop blur). Reference files: `project/plugins/axiom-blocks.html` for layout/components, `project/plugins/axiom-blocks-pricing.html` for typography rhythm.

Deliverables:

1. `project/docs/index.html` — docs landing
2. `project/docs/article.html` — single article view
3. `project/changelog.html` — release history

---

## Shared rules

- Dark theme only (`<html class="dark">`), same Tailwind CDN + config block as existing pages.
- Reuse the existing navbar, mobile drawer, and footer verbatim. Mark **Docs** as active on docs pages, **Changelog** as active on the changelog page.
- Coral `#E8593C` is the only accent. No purple, no blue gradients.
- Max content width 1280px, generous vertical rhythm. Don't introduce new fonts.
- Mobile-first: sidebars collapse to a drawer / dropdown below `md`.

---

## 1. `docs/index.html` — docs landing

Purpose: entry point. Visitor picks a plugin, then a topic.

Sections:
- **Hero (compact)** — H1 "Documentation", one-line subtitle. Search input centered (icon left, ⌘K hint right). Search is visual only — no behavior.
- **Plugin grid** — three cards (Axiom Blocks, Cartick, Specifico). Each card: plugin icon, name, one-line description, article count, "Browse docs →" link. Card hover: subtle border lift to coral.
- **Popular articles** — two-column list of 6–8 article links. Each row: article title, category pill, short excerpt, read-time.
- **Need help CTA** — small band: "Can't find what you need? → Contact support" linking to `/contact`.

No sidebar on this page.

---

## 2. `docs/article.html` — single article

Purpose: read a single documentation article. Three-column layout on desktop, single column on mobile.

Layout (desktop, ≥`lg`):
- **Left sidebar (260px, sticky)** — plugin selector at top (dropdown showing current plugin), then nested nav: category → article. Current article highlighted with coral left-border. Categories collapsible.
- **Main column (flex-1, max ~760px)** — article body.
- **Right sidebar (220px, sticky, hidden below `xl`)** — "On this page" table of contents auto-built from H2/H3. Active section highlighted.

Main column contents:
- **Breadcrumb** — Docs / Axiom Blocks / Getting Started / Installing the plugin
- **Article header** — H1 title, meta row (last updated date, "Edit on GitHub" link placeholder, estimated read time).
- **Article body** — use Tailwind `prose prose-invert` styles. Must include realistic examples of:
  - paragraphs, H2, H3
  - ordered + unordered lists
  - a **callout/admonition** component (info, warning, tip variants — coral-tinted left border, icon, soft background)
  - a **code block** with syntax-highlighted look (mono font, line numbers optional, copy button top-right)
  - inline code styling
  - an image/screenshot with rounded corners and a thin border (use a placeholder div with aspect-ratio)
  - a table
  - a blockquote
- **Was this helpful?** — yes/no buttons at end of article, small.
- **Prev / Next** — two-card footer linking to previous and next article in the category.

Use this sample article: "Installing the Axiom Blocks plugin" — write realistic prose for it, not lorem.

---

## 3. `changelog.html` — release history

Purpose: chronological list of releases across plugins, filterable by plugin.

Sections:
- **Hero (compact)** — H1 "Changelog", subtitle "What's new across wpaxiom plugins". RSS link on the right.
- **Filter bar** — pill buttons: All · Axiom Blocks · Cartick · Specifico. Active pill coral-filled, others outlined.
- **Timeline** — vertical timeline, newest at top. Each entry:
  - Left rail: a coral dot on a vertical line, date below in mono small caps
  - Card on the right: plugin badge (small pill with plugin name) + version (`v2.4.0` in mono) on one row, optional "Latest" coral tag if applicable
  - Release title (one-line summary, e.g. "Subscription analytics & faster license checks")
  - Grouped changes under labelled headings: **Added** / **Improved** / **Fixed** / **Removed** — each a tight bulleted list. Use semantic color dots if helpful (green for added, blue for improved, amber for fixed).
- **End-of-timeline** — "You've reached the beginning." muted text.

Include at least 6 realistic entries spanning all three plugins and the last ~4 months. Mix major and minor releases. Use real-sounding feature names (e.g. "Pricing Table block now supports per-row CTA buttons").

---

## Notes for the designer

- Don't add JS behavior beyond what existing pages already use (mobile drawer toggle, faq accordion pattern). The search field, ToC active-state, and filter pills can stay visually static — wiring happens in Next.js port.
- Keep markup semantic (`<article>`, `<aside>`, `<nav>`, `<time>`) — it gets ported to React.
- Match the existing `focus-coral` outline pattern on all interactive elements.
- When in doubt about a component (button, pill, card border radius, shadow), copy from `axiom-blocks.html`.
