import Link from 'next/link'

export function ChangelogHero() {
  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div className="absolute inset-0 hero-mesh" />
      <div className="absolute inset-0 hero-grid" />
      <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-14 lg:pt-20 lg:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Release history</div>
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[1] text-ink">
              Changelog
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-xl">
              What&apos;s new across wpaxiom plugins.
            </p>
          </div>
          <Link
            href="/changelog.xml"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line text-muted hover:text-ink hover:border-muted text-sm font-mono transition focus-coral whitespace-nowrap self-start sm:self-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
            RSS feed
          </Link>
        </div>
      </div>
    </section>
  )
}
