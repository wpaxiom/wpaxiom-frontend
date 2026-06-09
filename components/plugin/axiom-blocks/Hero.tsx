import { EditorPreview } from "./EditorPreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div className="absolute inset-0 hero-mesh" />
      <div className="absolute inset-0 hero-grid" />
      <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-24 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-ok/10 border border-ok/25 text-[11px] font-mono uppercase tracking-wider text-ok">
                <span className="w-1.5 h-1.5 rounded-full bg-ok" /> v1.0.0
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-elevated border border-line text-[11px] font-mono uppercase tracking-wider text-muted">
                Free
              </span>
            </div>

            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-[72px] font-semibold tracking-[-0.03em] leading-[1] text-ink">
              Axiom Blocks
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
              Forty-plus production-ready blocks, an enhanced Query Loop with conditional logic, and dynamic
              content from any custom field. The everyday toolkit for the WordPress block editor.
            </p>

            <div className="mt-8 flex items-center gap-6 flex-wrap text-sm">
              <span className="text-muted font-mono">WP 6.0+</span>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="https://wordpress.org/plugins/axiom-blocks/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral"
              >
                Get it on WordPress.org
              </a>
            </div>
          </div>

          <EditorPreview />
        </div>
      </div>
    </section>
  );
}
