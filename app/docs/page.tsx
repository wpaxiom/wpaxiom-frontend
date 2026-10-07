import Link from 'next/link'
import { DOC_NAV } from '@/lib/docs-nav'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Documentation — wpaxiom',
  description: 'Guides, references, and answers for every wpaxiom plugin.',
  path: '/docs',
})

const PLUGIN_CARDS = [
  {
    key: 'axiom-blocks',
    name: 'Axiom Blocks',
    description: 'Layout, content, conversion, accessibility, and WooCommerce blocks for the WordPress editor.',
    tags: ['Getting started', 'Blocks', 'Troubleshooting'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8593C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: 'cartick',
    name: 'Cartick',
    description: 'WooCommerce cart enhancements including sticky, menu, and off-canvas cart modules.',
    tags: ['Getting started', 'WooCommerce', 'Modules'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8593C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="20" r="1.6" /><circle cx="18" cy="20" r="1.6" />
        <path d="M3 4h2l2.7 11.2A2 2 0 0 0 9.6 17h8.3a2 2 0 0 0 1.9-1.5L22 7H6" />
      </svg>
    ),
  },
  {
    key: 'specifico',
    name: 'Specifico',
    description: 'Product specification tables for WooCommerce — reusable groups, category mapping, and per-product overrides.',
    tags: ['Getting started', 'Mapping', 'Block editor'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8593C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h4" />
      </svg>
    ),
  },
]

const POPULAR_ARTICLES = [
  { plugin: 'axiom-blocks', pluginLabel: 'Axiom Blocks', category: 'Blocks', title: 'Post Filter', excerpt: 'Add responsive search, taxonomy, and sorting controls to a Post Grid.', readTime: 7, slug: 'post-filter-block' },
  { plugin: 'specifico', pluginLabel: 'Specifico', category: 'Block editor', title: 'Comparison Table block', excerpt: 'Select two to four products and preview their comparison directly in the editor.', readTime: 4, slug: 'comparison-table-block' },
  { plugin: 'axiom-blocks', pluginLabel: 'Axiom Blocks', category: 'Blocks', title: 'Post Grid', excerpt: 'Build post grids and lists with editable card templates, flexible queries, and pagination.', readTime: 7, slug: 'post-grid-block' },
  { plugin: 'specifico', pluginLabel: 'Specifico', category: 'Block editor', title: 'Specification Table block', excerpt: 'Place the current product or a saved specification table in block-editor content.', readTime: 4, slug: 'specification-table-block' },
  { plugin: 'cartick', pluginLabel: 'Cartick', category: 'Modules', title: 'Off-Canvas Cart', excerpt: 'Configure the slide-in cart drawer, floating trigger, position, size, and behavior.', readTime: 6, slug: 'off-canvas-cart' },
  { plugin: 'specifico', pluginLabel: 'Specifico', category: 'Getting started', title: 'Creating your first table', excerpt: 'Build a specification table from reusable groups and show it on your products.', readTime: 5, slug: 'creating-your-first-table' },
  { plugin: 'specifico', pluginLabel: 'Specifico', category: 'Backup & migration', title: 'Export & Import', excerpt: 'Back up or migrate tables, groups, mappings, settings, and product data.', readTime: 6, slug: 'export-and-import' },
  { plugin: 'axiom-blocks', pluginLabel: 'Axiom Blocks', category: 'Troubleshooting', title: 'License activation troubleshooting', excerpt: 'Resolve site-quota, subscription, and activation problems in order.', readTime: 3, slug: 'license-activation-troubleshooting' },
]

export default function DocsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/70">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 hero-grid" />
        <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-14 lg:pt-20 lg:pb-16 text-center">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Help center</div>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[1] text-ink">
            Documentation
          </h1>
          <p className="mt-5 text-lg text-muted leading-relaxed max-w-xl mx-auto">
            Guides, references, and answers for every wpaxiom plugin.
          </p>

          <form role="search" action="#" className="mt-9 max-w-xl mx-auto">
            <label className="relative block">
              <span className="sr-only">Search documentation</span>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search for blocks, licenses, webhooks…"
                className="w-full pl-11 pr-20 py-3.5 rounded-lg bg-surface border border-line text-ink placeholder:text-subtle focus-coral focus:border-muted transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-mono text-muted pointer-events-none">
                <kbd className="px-1.5 py-0.5 rounded border border-line bg-elevated">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-line bg-elevated">K</kbd>
              </span>
            </label>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="text-subtle uppercase tracking-wider">// Popular:</span>
            {['Installing Axiom Blocks', 'License activation', 'Query Loop Pro', 'Webhooks'].map((q) => (
              <span key={q} className="px-2.5 py-1 rounded-md bg-elevated border border-line text-muted">
                {q}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Plugin grid */}
      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Pick a plugin</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Browse docs by product.</h2>
            <p className="mt-4 text-muted leading-relaxed">
              Each plugin has its own categorised guide with reference docs, examples, and troubleshooting notes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLUGIN_CARDS.map((p) => {
              const nav = DOC_NAV[p.key]
              const firstSlug = nav?.categories[0]?.articles[0]?.slug ?? ''
              const articleCount = nav?.categories.reduce((total, category) => total + category.articles.length, 0) ?? 0
              return (
                <Link
                  key={p.key}
                  href={`/docs/${p.key}/${firstSlug}`}
                  className="group rounded-xl bg-surface border border-line border-t-2 border-t-coral p-7 transition duration-200 hover:-translate-y-0.5 hover:border-muted hover:border-t-coral focus-coral block"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="inline-flex bg-elevated border border-line p-2.5 rounded-lg">{p.icon}</div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted">{articleCount} articles</span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-ink">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{p.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-line text-subtle">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-muted group-hover:text-coral transition flex items-center gap-1.5">
                      Browse
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-x-0.5">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular articles */}
      <section className="border-b border-line/70 bg-surface/30">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Most read this week</div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Popular articles.</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-2 max-w-6xl">
            {POPULAR_ARTICLES.map((article) => (
              <Link
                key={`${article.plugin}-${article.slug}`}
                href={`/docs/${article.plugin}/${article.slug}`}
                className="group block py-5 border-b border-line/60 hover:border-coral/40 transition focus-coral rounded-sm -mx-2 px-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-coral/40 bg-coral/10 text-coral">
                        {article.pluginLabel}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-subtle">{article.category}</span>
                    </div>
                    <h3 className="text-base font-medium text-ink group-hover:text-coral transition tracking-tight">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted leading-relaxed">{article.excerpt}</p>
                  </div>
                  <span className="text-[11px] font-mono text-subtle whitespace-nowrap mt-1">{article.readTime} min</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Support band */}
      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-coral/15 border border-coral/30 flex items-center justify-center flex-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8593C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-coral">// Can&apos;t find it?</div>
                <p className="mt-0.5 text-ink tracking-tight">Contact the people who maintain the plugins.</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral whitespace-nowrap"
            >
              Contact support
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
