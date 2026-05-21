'use client'

import { useEffect, useState } from 'react'
import type { DocHeading } from '@/lib/docs'

export function TableOfContents({ headings }: { headings: DocHeading[] }) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 },
    )

    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="hidden xl:block py-12">
      <div className="sticky top-24">
        <p className="text-xs font-mono uppercase tracking-wider text-subtle mb-4">// On this page</p>
        <nav aria-label="Table of contents">
          <ul className="space-y-px text-sm">
            {headings.map((h) => {
              const isActive = active === h.id
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={`block py-1.5 border-l-2 transition ${
                      h.level === 3 ? 'pl-6 text-[13px]' : 'pl-3'
                    } ${
                      isActive
                        ? 'border-coral text-ink'
                        : 'border-line text-muted hover:text-ink'
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
