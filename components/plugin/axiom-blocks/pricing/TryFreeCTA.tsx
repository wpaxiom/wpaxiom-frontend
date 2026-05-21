import Link from "next/link";

function WordPressIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.06 17.5-4.4-7.62 4.4 1.18Zm1.06 0V13.06l4.4-1.18Zm0-7.6L7.7 11l3.24-7.5Zm1.06 0V3.5L16.3 11Z" />
    </svg>
  );
}

export function TryFreeCTA() {
  return (
    <section className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto rounded-2xl border border-line bg-surface p-10 text-center">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Not ready?</div>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            Still not sure? Try the free version first.
          </h2>
          <p className="mt-4 text-muted leading-relaxed max-w-xl mx-auto">
            12 essential blocks, 20 patterns, full theme.json integration. No card, no signup. Upgrade only
            if you outgrow it.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://wordpress.org/plugins/axiom-blocks/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
            >
              <WordPressIcon size={16} />
              Get the free version on WordPress.org
            </a>
            <Link
              href="/plugins/axiom-blocks"
              className="inline-flex items-center gap-1.5 px-3 py-3 text-sm text-muted hover:text-ink transition"
            >
              Compare free vs Pro →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
