export type NavArticle = {
  slug: string
  title: string
}

export type NavCategory = {
  label: string
  articles: NavArticle[]
}

export type PluginNav = {
  label: string
  version: string
  icon: 'axiom-blocks' | 'cartick' | 'specifico'
  categories: NavCategory[]
}

export const DOC_NAV: Record<string, PluginNav> = {
  'axiom-blocks': {
    label: 'Axiom Blocks',
    version: 'v1.0.4',
    icon: 'axiom-blocks',
    categories: [
      {
        label: 'Getting Started',
        articles: [
          { slug: 'installing-the-plugin', title: 'Installing the plugin' },
          { slug: 'activating-your-license', title: 'Activating your license' },
        ],
      },
      {
        label: 'Axiom Blocks',
        articles: [
          { slug: 'tabs-block', title: 'Tabs' },
          { slug: 'pricing-table-block', title: 'Pricing Table' },
          { slug: 'advanced-section-block', title: 'Advanced Section' },
          { slug: 'before-after-slider-block', title: 'Before/After Slider' },
          { slug: 'countdown-timer-block', title: 'Countdown Timer' },
          { slug: 'copy-to-clipboard-block', title: 'Copy to Clipboard' },
          { slug: 'star-rating-block', title: 'Star Rating' },
          { slug: 'shape-divider-block', title: 'Shape Divider' },
          { slug: 'device-visibility-block', title: 'Device Visibility' },
          { slug: 'reading-progress-bar-block', title: 'Reading Progress Bar' },
          { slug: 'trust-badges-block', title: 'Trust Badges' },
          { slug: 'free-shipping-progress-block', title: 'Free Shipping Progress' },
          { slug: 'advanced-heading-block', title: 'Advanced Heading' },
          { slug: 'advanced-button-block', title: 'Advanced Button' },
          { slug: 'icon-block', title: 'Icon' },
          { slug: 'icon-list-block', title: 'Icon List' },
          { slug: 'accordion-block', title: 'Accordion' },
          { slug: 'notice-block', title: 'Notice / Alert' },
          { slug: 'counter-group-block', title: 'Counter' },
          { slug: 'testimonials-block', title: 'Testimonials' },
          { slug: 'info-box-block', title: 'Info Box' },
        ],
      },
      {
        label: 'Troubleshooting',
        articles: [
          { slug: 'license-activation-troubleshooting', title: 'License activation' },
          { slug: 'blocks-not-showing', title: 'Blocks not showing' },
        ],
      },
    ],
  },
  cartick: {
    label: 'Cartick',
    version: 'v1.0.2',
    icon: 'cartick',
    categories: [
      {
        label: 'Getting Started',
        articles: [
          { slug: 'installing-cartick', title: 'Installing Cartick' },
          { slug: 'enabling-modules', title: 'Enabling and configuring modules' },
        ],
      },
      {
        label: 'Modules',
        articles: [
          { slug: 'add-to-cart', title: 'Add to Cart Button' },
          { slug: 'sticky-cart', title: 'Sticky Cart' },
          { slug: 'menu-cart', title: 'Menu Cart' },
          { slug: 'off-canvas-cart', title: 'Off-Canvas Cart' },
        ],
      },
    ],
  },
  specifico: {
    label: 'Specifico',
    version: 'v1.0.4',
    icon: 'specifico',
    categories: [
      {
        label: 'Getting Started',
        articles: [
          { slug: 'installing-specifico', title: 'Installing Specifico' },
          { slug: 'creating-your-first-table', title: 'Creating your first table' },
        ],
      },
      {
        label: 'Per-product',
        articles: [
          { slug: 'per-product-overrides', title: 'Per-product overrides' },
        ],
      },
      {
        label: 'Mapping',
        articles: [
          { slug: 'mapping-rules', title: 'Mapping rules' },
        ],
      },
      {
        label: 'Settings',
        articles: [
          { slug: 'display-settings', title: 'Display settings' },
        ],
      },
      {
        label: 'Developers',
        articles: [
          { slug: 'shortcode', title: 'Shortcode' },
          { slug: 'hooks-and-templates', title: 'Hooks & template overrides' },
          { slug: 'structured-data', title: 'Structured data (SEO)' },
        ],
      },
      {
        label: 'Help',
        articles: [
          { slug: 'frequently-asked-questions', title: 'Frequently asked questions' },
        ],
      },
    ],
  },
}

export function findArticleInNav(
  plugin: string,
  slug: string,
): { categoryLabel: string; article: NavArticle } | null {
  const pluginNav = DOC_NAV[plugin]
  if (!pluginNav) return null
  for (const cat of pluginNav.categories) {
    const article = cat.articles.find((a) => a.slug === slug)
    if (article) return { categoryLabel: cat.label, article }
  }
  return null
}
