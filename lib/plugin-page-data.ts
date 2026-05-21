import { Tag, Pin, ShoppingBag, PanelRight, Layers, Workflow, Database, Filter, Eye, Zap, LayoutGrid, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PageFeature = { Icon: LucideIcon; title: string; body: string };
export type PageFAQ = { question: string; answer: string; defaultOpen?: boolean };
export type PageQuote = { body: string; name: string; role: string };
export type PageBadge = { label: string; tone: "neutral" | "coral" | "ok"; withDot?: boolean };

export type PluginPageData = {
  badges: PageBadge[];
  rating?: string;
  reviewCount?: string;
  installs?: string;
  wpVersion: string;
  featureGrid: { eyebrow: string; headline: string; lead: string };
  features: PageFeature[];
  testimonialsHeadline: string;
  faqs: PageFAQ[];
  quotes: PageQuote[];
  support: { resolvedThreads: string; firstReply: string };
};

export const PLUGIN_PAGE_DATA: Record<string, PluginPageData> = {
  cartick: {
    badges: [
      { label: "Free", tone: "neutral" },
    ],
    wpVersion: "WP 5.8+ · WC 6.3+",
    featureGrid: {
      eyebrow: "// Capabilities",
      headline: "Every cart enhancement your WooCommerce store needs.",
      lead: "Four independent modules — enable only what you need. Each has its own settings panel and loads zero frontend code when disabled.",
    },
    features: [
      {
        Icon: Tag,
        title: "Add to Cart Button",
        body: "Set custom button labels per product type for shop pages and single product pages. Apply padding and colour overrides site-wide without touching a template.",
      },
      {
        Icon: Pin,
        title: "Sticky Cart",
        body: "A floating add-to-cart bar that follows the customer on single product pages. Configurable position, scroll-trigger offset, and product image/price display.",
      },
      {
        Icon: ShoppingBag,
        title: "Menu Cart",
        body: "Inject a live cart count, subtotal, or both into any registered nav menu. Updates via WooCommerce's fragment system — no page reload needed.",
      },
      {
        Icon: PanelRight,
        title: "Off-Canvas Cart",
        body: "A slide-in cart drawer triggered by a floating button. Full mini-cart with quantity controls, item removal, subtotal, and a direct checkout link.",
      },
      {
        Icon: Layers,
        title: "Fully modular",
        body: "Enable only what you need. Disabled modules inject zero HTML, CSS, or JavaScript into the frontend — no dead weight.",
      },
      {
        Icon: Workflow,
        title: "WooCommerce-native",
        body: "Reads WC's own cart object, fragments, taxes, coupons, and shipping rules. Every product type, gateway, and extension keeps working out of the box.",
      },
    ],
    testimonialsHeadline: "Trusted on real WooCommerce stores.",
    faqs: [
      {
        question: "What does Cartick add to my store?",
        answer:
          "Four independent modules: Add to Cart Button (customise labels and styles), Sticky Cart (floating bar on product pages), Menu Cart (cart widget in your nav), and Off-Canvas Cart (a slide-in cart drawer). Enable the ones you need — each works independently.",
        defaultOpen: true,
      },
      {
        question: "Does it work with any WooCommerce theme?",
        answer:
          "Yes. Cartick hooks into WooCommerce's standard action and filter system and reads from WC's cart object. It works with classic themes, FSE block themes, and heavily customised setups.",
      },
      {
        question: "Does the Off-Canvas Cart support Subscriptions and Bundles?",
        answer:
          "Yes. The Off-Canvas Cart renders whatever WooCommerce says is in the cart — subscriptions, product bundles, and variations are all handled natively.",
      },
      {
        question: "Is it free forever?",
        answer:
          "Yes. Cartick has no Pro version, no upsell, and no nag screens. It's GPL-licensed on WP.org with source on GitHub.",
      },
      {
        question: "How do I customise the styling?",
        answer:
          "The Add to Cart Button module has built-in colour and padding controls in the admin. For other modules, all styles are scoped to Cartick-specific CSS classes — override them from your theme or a custom stylesheet.",
      },
      {
        question: "Where do I get help?",
        answer:
          "The WordPress.org support forum. We monitor threads daily — median first reply is around two days.",
      },
    ],
    quotes: [
      {
        body: "Enabled the sticky cart and off-canvas drawer in under ten minutes. The module system is exactly right — I turned on what I needed and nothing else loaded.",
        name: "Jonas Weil",
        role: "Senior Woo developer · Nordic Commerce",
      },
      {
        body: "Replaced our custom sticky bar with Cartick on a high-volume shop. The scroll-trigger saved a complete CSS rewrite, and the menu cart works perfectly on our block theme.",
        name: "Iris Tanaka",
        role: "Performance lead · Tonalia",
      },
      {
        body: "The Add to Cart button settings matched our design system without touching a single template file. Small plugin, genuinely useful.",
        name: "Diego Marín",
        role: "Freelance WooCommerce dev",
      },
    ],
    support: {
      resolvedThreads: "940+ resolved threads",
      firstReply: "Median first reply: ~2 days",
    },
  },

  specifico: {
    badges: [
      { label: "Free", tone: "neutral" },
    ],
    wpVersion: "WP 5.8+ · WC 6.3+",
    featureGrid: {
      eyebrow: "// Capabilities",
      headline: "Spec tables, from your existing data.",
      lead: "Render comparison tables, attribute matrices, and product spec sheets straight from custom fields you already have.",
    },
    features: [
      {
        Icon: Database,
        title: "Reads any field type",
        body: "ACF, Meta Box, Pods, native post meta. Strings, numbers, taxonomies, relations, and repeaters.",
      },
      {
        Icon: Filter,
        title: "Sortable + filterable",
        body: "Click any column header to sort. Add a filter row to narrow on text or numeric ranges. No build step.",
      },
      {
        Icon: Eye,
        title: "WCAG AA accessible",
        body: "Real table elements, proper headers and scopes, keyboard sort, screen-reader column announcements.",
      },
      {
        Icon: Zap,
        title: "Lightweight",
        body: "Static HTML by default. Sort/filter scripts (4kb) load only when columns that need them are present.",
      },
      {
        Icon: LayoutGrid,
        title: "Block + shortcode",
        body: "Drop it in via the block editor with a config sidebar, or use [specifico] in classic editors and theme files.",
      },
      {
        Icon: Palette,
        title: "Theme-aware",
        body: "Reads colours, borders, and spacing from your theme.json. No fight with your design system.",
      },
    ],
    testimonialsHeadline: "Quietly powering tens of thousands of spec tables.",
    faqs: [
      {
        question: "Does it support ACF?",
        answer:
          "Yes — including ACF Pro repeater and flexible content fields. Meta Box and Pods are supported on the same code path.",
        defaultOpen: true,
      },
      {
        question: "Can I sort by a custom field's value?",
        answer:
          "Yes. Set the column's data type (text, number, date) and Specifico will sort correctly client-side. Numeric and date columns sort numerically, not lexicographically.",
      },
      {
        question: "How does it handle relations?",
        answer:
          "One-to-one fields render as the related post's title (linked, optional). One-to-many render as a comma-separated list. Custom render templates can override either.",
      },
      {
        question: "Will it slow down my page?",
        answer:
          "No. Static HTML by default. The sort and filter scripts together weigh 4kb gzipped, and only load when those features are configured on the page.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes. No Pro version, no usage limits, no row caps. GPL on WP.org and source on GitHub.",
      },
      {
        question: "Where do I get help?",
        answer:
          "WordPress.org support forum. We monitor threads daily — most questions are answered the same day.",
      },
    ],
    quotes: [
      {
        body: "Specifico turned a six-week spec-table project into an afternoon. The accessibility work alone is rare in this corner of WordPress.",
        name: "Priya Anand",
        role: "Freelance developer · @priya.dev",
      },
      {
        body: "We power 80+ product comparison pages with Specifico. Zero JavaScript on most of them — pure HTML tables that just work.",
        name: "Tomáš Krajina",
        role: "Senior dev · Outpost Magazine",
      },
      {
        body: "The ACF repeater support is the killer feature. We were rolling our own table renderer for years; this replaced 600 lines of code in one afternoon.",
        name: "Sienna Park",
        role: "Tech lead · Maker Studio",
      },
    ],
    support: {
      resolvedThreads: "520+ resolved threads",
      firstReply: "Median first reply: same day",
    },
  },
};
