'use client'

import { useState } from 'react'
import { CHANGELOG, PLUGINS, type ChangeType } from '@/lib/changelog-data'

const CHANGE_COLORS: Record<ChangeType, { dot: string; label: string }> = {
  Added: { dot: 'bg-ok', label: 'text-ok' },
  Improved: { dot: 'bg-info', label: 'text-info' },
  Fixed: { dot: 'bg-warn', label: 'text-warn' },
  Removed: { dot: 'bg-subtle', label: 'text-muted' },
}

const PLUGIN_LABELS: Record<string, string> = {
  'axiom-blocks': 'Axiom Blocks',
  cartick: 'Cartick',
  specifico: 'Specifico',
}

export function ChangelogClient() {
  const [activePlugin, setActivePlugin] = useState<string>('all')

  const filtered =
    activePlugin === 'all' ? CHANGELOG : CHANGELOG.filter((e) => e.plugin === activePlugin)

  return (
    <>
      {/* Filter bar */}
      <div className="border-b border-line/70 bg-surface/30 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActivePlugin('all')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-mono transition whitespace-nowrap focus-coral ${
              activePlugin === 'all'
                ? 'bg-coral text-white'
                : 'border border-line text-muted hover:text-ink hover:border-muted'
            }`}
          >
            All
          </button>
          {PLUGINS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlugin(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-mono transition whitespace-nowrap focus-coral ${
                activePlugin === p.id
                  ? 'bg-coral text-white'
                  : 'border border-line text-muted hover:text-ink hover:border-muted'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="relative pl-6 sm:pl-10">
          <div className="absolute left-[7px] sm:left-[11px] top-0 bottom-0 w-px bg-line" />

          <div className="space-y-12">
            {filtered.map((entry, i) => {
              const date = new Date(entry.date)
              const dateStr = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
              const changeGroups = (['Added', 'Improved', 'Fixed', 'Removed'] as ChangeType[]).filter(
                (type) => entry.changes.some((c) => c.type === type),
              )

              return (
                <div key={i} className="relative">
                  <div className="absolute -left-[22px] sm:-left-[30px] top-1.5 w-3 h-3 rounded-full bg-coral border-2 border-base" />
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted mb-4">{dateStr}</div>

                  <div className="rounded-xl border border-line bg-surface p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border border-coral/40 bg-coral/10 text-coral">
                          {PLUGIN_LABELS[entry.plugin]}
                        </span>
                        <span className="text-sm font-mono text-muted">{entry.version}</span>
                        {entry.latest && (
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-coral text-white">
                            Latest
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="text-lg font-semibold tracking-tight text-white mb-6">{entry.summary}</h2>

                    <div className="space-y-5">
                      {changeGroups.map((type) => {
                        const items = entry.changes.filter((c) => c.type === type)
                        const colors = CHANGE_COLORS[type]
                        return (
                          <div key={type}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} flex-none`} />
                              <span className={`text-[11px] font-mono uppercase tracking-wider ${colors.label}`}>{type}</span>
                            </div>
                            <ul className="space-y-1.5 pl-4">
                              {items.map((item, j) => (
                                <li key={j} className="text-sm text-muted leading-relaxed flex gap-2">
                                  <span className="text-subtle mt-2 flex-none">—</span>
                                  <span>{item.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="relative mt-12 pl-0">
            <div className="absolute -left-[22px] sm:-left-[30px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-line border-2 border-base" />
            <p className="text-sm font-mono text-subtle italic">
              {filtered.length === 0 ? 'No entries for this plugin yet.' : "You've reached the beginning."}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
