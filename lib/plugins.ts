import { ShoppingCart, AlignLeft, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Plugin = {
  slug: string;
  name: string;
  tagline: string;
  Icon: LucideIcon;
  badge: { label: string; tone: "free" | "pro" };
  meta: string;
  wpOrgUrl: string;
  detailsHref: string;
  installCta: { label: string; href: string };
  highlight?: boolean;
};

export const PLUGINS: Plugin[] = [
  {
    slug: "cartick",
    name: "Cartick",
    tagline:
      "Modular WooCommerce cart enhancements — sticky add-to-cart bars, off-canvas drawers, menu cart widgets, and button customisation.",
    Icon: ShoppingCart,
    badge: { label: "Free", tone: "free" },
    meta: "WP 5.8+",
    wpOrgUrl: "https://wordpress.org/plugins/cartick/",
    detailsHref: "/plugins/cartick",
    installCta: { label: "View on WordPress.org", href: "https://wordpress.org/plugins/cartick/" },
  },
  {
    slug: "specifico",
    name: "Specifico",
    tagline:
      "Product spec tables that read your existing custom fields. Sortable, filterable, accessible.",
    Icon: AlignLeft,
    badge: { label: "Free", tone: "free" },
    meta: "WP 5.8+",
    wpOrgUrl: "https://wordpress.org/plugins/specifico/",
    detailsHref: "/plugins/specifico",
    installCta: { label: "View on WordPress.org", href: "https://wordpress.org/plugins/specifico/" },
  },
  {
    slug: "axiom-blocks",
    name: "Axiom Blocks",
    tagline:
      "Precision-built blocks for the WordPress block editor. Free core, optional Pro extension.",
    Icon: LayoutGrid,
    badge: { label: "Free", tone: "free" },
    meta: "WP 6.4+",
    wpOrgUrl: "https://wordpress.org/plugins/axiom-blocks/",
    detailsHref: "/plugins/axiom-blocks",
    installCta: { label: "View Plugin", href: "/plugins/axiom-blocks" },
    highlight: true,
  },
];
