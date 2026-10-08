import { Tag, Pin, ShoppingBag, PanelRight, Layers, Workflow, Database, Filter, Eye, Zap, LayoutGrid, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PageFeature = { Icon: LucideIcon; title: string; body: string };
export type PageFAQ = { question: string; answer: string; defaultOpen?: boolean };
export type PageBadge = { label: string; tone: "neutral" | "coral" | "ok"; withDot?: boolean };

export type PluginPageData = {
  badges: PageBadge[];
  rating?: string;
  reviewCount?: string;
  installs?: string;
  wpVersion: string;
  featureGrid: { eyebrow: string; headline: string; lead: string };
  features: PageFeature[];
  faqs: PageFAQ[];
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
          "Yes. Cartick has no Pro version, no upsell, and no nag screens. It is GPLv2-licensed.",
      },
      {
        question: "How do I customise the styling?",
        answer:
          "The Add to Cart Button module has built-in colour and padding controls in the admin. For other modules, all styles are scoped to Cartick-specific CSS classes — override them from your theme or a custom stylesheet.",
      },
      {
        question: "Where do I get help?",
        answer:
          "Email support@wpaxiom.com with the plugin version, WordPress version, and a clear description of the issue.",
      },
    ],
  },

  specifico: {
    badges: [
      { label: "Free", tone: "neutral" },
    ],
    wpVersion: "WP 5.8+ · WC 6.3+",
    featureGrid: {
      eyebrow: "// Capabilities",
      headline: "One specification system for your whole catalog.",
      lead: "Build reusable groups, map tables to products, and keep every simple or variable product accurate without rebuilding the same spec sheet.",
    },
    features: [
      {
        Icon: Database,
        title: "Reusable spec groups",
        body: "Define groups such as Display, Materials, or Connectivity once, combine them into tables, and reuse them across your WooCommerce catalog.",
      },
      {
        Icon: Filter,
        title: "Smart product mapping",
        body: "Assign tables by product category, tag, or individual product. Matching products inherit the right structure and default values automatically.",
      },
      {
        Icon: Eye,
        title: "Per-product control",
        body: "Keep the mapped table and change only a product's values, or switch to a fully custom table when one item needs different groups and rows.",
      },
      {
        Icon: Zap,
        title: "Variation-aware specs",
        body: "Set value overrides per variation. The table follows the shopper's selection and can add live rows for attributes such as size or colour.",
      },
      {
        Icon: LayoutGrid,
        title: "Blocks, shortcodes + comparison",
        body: "Place specification or comparison tables with Gutenberg blocks or shortcodes, and let shoppers compare up to four products side by side.",
      },
      {
        Icon: Palette,
        title: "Store-ready presentation",
        body: "Choose a preset or custom style, rename the product tab, override the template in your theme, and add accurate specification data to Product schema.",
      },
    ],
    faqs: [
      {
        question: "How do products get the right specification table?",
        answer:
          "Create mapping rules by product category, tag, or individual product. A matching product inherits that table automatically, and you can still override its values or give it a custom table.",
        defaultOpen: true,
      },
      {
        question: "Does Specifico support variable products?",
        answer:
          "Yes. Specifico 1.0.8 lets you set specification values per variation. The table updates when shoppers choose a variation, while empty variation fields inherit the product-level value.",
      },
      {
        question: "Can shoppers compare products?",
        answer:
          "Yes. You can show compare buttons on product and shop pages, use the slide-in comparison drawer, or embed a comparison of two to four products with the block or shortcode.",
      },
      {
        question: "Can I place a specification table outside the product tab?",
        answer:
          "Yes. Use the Specification Table block or the [specifico] shortcode. You can render the current product or target a specific product or saved table, depending on the tool.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes. No Pro version, no usage limits, no row caps. GPL on WP.org and source on GitHub.",
      },
      {
        question: "Where do I get help?",
        answer:
          "Use the WordPress.org support forum for public questions or email support@wpaxiom.com for private account-related help.",
      },
    ],
  },
};
