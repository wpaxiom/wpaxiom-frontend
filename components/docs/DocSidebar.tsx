'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { DOC_NAV, type PluginNav } from '@/lib/docs-nav'

const PLUGIN_ICONS: Record<string, React.ReactNode> = {
  'axiom-blocks': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8593C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  cartick: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8593C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.6" /><circle cx="18" cy="20" r="1.6" />
      <path d="M3 4h2l2.7 11.2A2 2 0 0 0 9.6 17h8.3a2 2 0 0 0 1.9-1.5L22 7H6" />
    </svg>
  ),
  specifico: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8593C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" />
    </svg>
  ),
}

export function DocSidebar({ plugin, currentSlug }: { plugin: string; currentSlug: string }) {
  const [selectorOpen, setSelectorOpen] = useState(false)
  const nav = DOC_NAV[plugin] as PluginNav | undefined

  if (!nav) return null

  return (
    <aside className="hidden lg:block py-12">
      <div className="sticky top-24">
        {/* Plugin selector */}
        <label className="text-xs font-mono uppercase tracking-wider text-subtle">// Plugin</label>
        <div className="relative mt-2">
          <button
            type="button"
            onClick={() => setSelectorOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-surface border border-line hover:border-muted text-left text-sm transition focus-coral"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="inline-flex w-6 h-6 rounded bg-elevated border border-line items-center justify-center flex-none">
                {PLUGIN_ICONS[plugin]}
              </span>
              <span className="font-medium text-ink truncate">{nav.label}</span>
              <span className="font-mono text-[10px] text-muted">{nav.version}</span>
            </span>
            <svg className="text-muted flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {selectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-lg overflow-hidden z-10 shadow-lg">
              {Object.entries(DOC_NAV).map(([key, p]) => (
                <Link
                  key={key}
                  href={`/docs/${key}/${p.categories[0]?.articles[0]?.slug ?? ''}`}
                  onClick={() => setSelectorOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-elevated text-muted hover:text-ink transition"
                >
                  <span className="inline-flex w-5 h-5 rounded bg-elevated border border-line items-center justify-center flex-none">
                    {PLUGIN_ICONS[key]}
                  </span>
                  {p.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="mt-8" aria-label="Documentation">
          {nav.categories.map((cat) => {
            const isOpen = cat.articles.some((a) => a.slug === currentSlug)
            return (
              <details key={cat.label} open={isOpen} className="group mb-2">
                <summary className="flex items-center justify-between py-1.5 text-xs font-mono uppercase tracking-wider text-muted hover:text-ink cursor-pointer select-none">
                  <span className="flex items-center gap-2">
                    <span className="cat-chev inline-block transition-transform group-open:rotate-90">›</span>
                    {cat.label}
                  </span>
                  <span className="text-subtle">{cat.articles.length}</span>
                </summary>
                <ul className="mt-2 space-y-px text-sm">
                  {cat.articles.map((article) => {
                    const active = article.slug === currentSlug
                    return (
                      <li key={article.slug}>
                        <Link
                          href={`/docs/${plugin}/${article.slug}`}
                          className={`block py-1.5 pl-5 border-l transition ${
                            active
                              ? 'border-coral text-coral bg-coral/[0.06] -mr-2 pr-2 rounded-r font-medium'
                              : 'border-line text-muted hover:text-ink'
                          }`}
                          style={active ? { borderLeftColor: '#E8593C', paddingLeft: '18px' } : undefined}
                        >
                          {article.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </details>
            )
          })}
        </nav>

        <div className="mt-10 pt-6 border-t border-line">
          <Link
            href="/contact"
            className="text-xs font-mono text-muted hover:text-ink transition flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
            </svg>
            Ask support
          </Link>
        </div>
      </div>
    </aside>
  )
}
