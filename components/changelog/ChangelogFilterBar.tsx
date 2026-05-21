import Link from 'next/link'
import { PLUGINS } from '@/lib/changelog-data'

export function ChangelogFilterBar({ activePlugin }: { activePlugin: string }) {
  return (
    <div className="border-b border-line/70 bg-surface/30 sticky top-16 z-30 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto">
        <Link
          href="/changelog"
          className={`px-3.5 py-1.5 rounded-full text-sm font-mono transition whitespace-nowrap focus-coral ${
            activePlugin === 'all'
              ? 'bg-coral text-white'
              : 'border border-line text-muted hover:text-ink hover:border-muted'
          }`}
        >
          All
        </Link>
        {PLUGINS.map((p) => (
          <Link
            key={p.id}
            href={`/changelog/${p.id}`}
            className={`px-3.5 py-1.5 rounded-full text-sm font-mono transition whitespace-nowrap focus-coral ${
              activePlugin === p.id
                ? 'bg-coral text-white'
                : 'border border-line text-muted hover:text-ink hover:border-muted'
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
