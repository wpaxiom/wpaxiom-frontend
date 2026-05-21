export function Header() {
  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div className="absolute inset-0 hero-mesh" />
      <div className="absolute inset-0 hero-grid" />
      <div className="relative max-w-[1280px] mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-surface/60 text-xs text-muted font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-coral" />
          Axiom Blocks Pro
        </div>
        <h1 className="mt-6 text-5xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-ink">
          Simple, transparent pricing.
        </h1>
        <p className="mt-5 text-lg text-muted max-w-xl mx-auto">
          Start free. Upgrade when you need more.
        </p>
      </div>
    </section>
  );
}
