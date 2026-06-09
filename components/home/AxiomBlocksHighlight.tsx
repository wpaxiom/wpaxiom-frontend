import Link from "next/link";
import { Check, Square, AlignLeft, Circle } from "lucide-react";

const FEATURES: { title: string; body: string }[] = [
  {
    title: "12 production-ready blocks",
    body: "— tabs, accordion, countdown timer, before/after slider, star rating, and more.",
  },
  {
    title: "Free Shipping Progress",
    body: "— WooCommerce cart integration with live REST updates.",
  },
  {
    title: "Device Visibility",
    body: "— show or hide inner blocks per breakpoint.",
  },
  {
    title: "Theme.json native",
    body: "— reads your theme's colors, spacing, and font scales automatically.",
  },
  {
    title: "Per-block asset loading",
    body: "— CSS and JS loaded only on pages that use each block.",
  },
];

export function AxiomBlocksHighlight() {
  return (
    <section className="relative border-b border-line/70 overflow-hidden">
      <div className="absolute inset-0 opacity-60 hero-mesh" />
      <div className="relative max-w-[1280px] mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-coral/40 bg-coral/10 text-xs text-coral font-mono">
              ★ FLAGSHIP
            </div>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
              Axiom Blocks
              <br />
              <span className="text-muted">the toolkit your block editor was missing.</span>
            </h2>
            <p className="mt-6 text-muted leading-relaxed max-w-lg">
              Precision-built blocks for the WordPress block editor. From animated sliders and
              countdown timers to WooCommerce shipping progress — each block is tightly scoped,
              zero-dependency, and ready to use out of the box.
            </p>

            <ul className="mt-8 space-y-3.5">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <Check size={18} strokeWidth={2} className="mt-0.5 flex-none text-coral" />
                  <span className="text-ink/90">
                    <span className="font-medium">{feature.title}</span>{" "}
                    <span className="text-muted">{feature.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="https://wordpress.org/plugins/axiom-blocks/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral"
              >
                Get it on WordPress.org
              </a>
              <Link
                href="/plugins/axiom-blocks"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Editor preview */}
          <div className="relative">
            <div className="absolute -inset-4 bg-coral/10 blur-3xl rounded-full opacity-60" />
            <div className="relative rounded-xl border border-line bg-surface overflow-hidden shadow-2xl shadow-black/20">
              <div className="px-3 py-2 flex items-center gap-2 border-b border-line bg-elevated/60">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                </div>
                <span className="ml-2 text-[11px] font-mono text-subtle">wp-admin/post.php?action=edit</span>
              </div>
              <div className="grid grid-cols-[1fr,160px]">
                <div className="p-6 space-y-4">
                  <div className="h-2.5 w-3/5 rounded bg-elevated" />
                  <div className="h-2 w-full rounded bg-elevated/70" />
                  <div className="h-2 w-11/12 rounded bg-elevated/70" />
                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <div className="aspect-square rounded-md bg-elevated border border-line/80 flex items-center justify-center">
                      <Square size={14} strokeWidth={1.6} className="text-coral" />
                    </div>
                    <div className="aspect-square rounded-md bg-coral/10 border border-coral/30 flex items-center justify-center">
                      <AlignLeft size={14} strokeWidth={1.6} className="text-coral" />
                    </div>
                    <div className="aspect-square rounded-md bg-elevated border border-line/80 flex items-center justify-center">
                      <Circle size={14} strokeWidth={1.6} className="text-coral" />
                    </div>
                  </div>
                  <div className="h-2 w-4/5 rounded bg-elevated/70" />
                  <div className="h-2 w-3/5 rounded bg-elevated/50" />
                  <div className="mt-2 h-16 rounded-lg border border-line bg-elevated/40 flex items-center justify-center">
                    <div className="flex gap-2 items-center">
                      <div className="w-6 h-1.5 rounded bg-coral/50" />
                      <div className="w-16 h-1.5 rounded bg-elevated" />
                      <div className="w-6 h-1.5 rounded bg-elevated" />
                    </div>
                  </div>
                </div>
                <aside className="border-l border-line bg-base/40 p-4 space-y-3">
                  <div className="text-[10px] font-mono text-subtle uppercase tracking-wider">Inspector</div>
                  <div className="space-y-2">
                    <div className="h-1.5 rounded bg-elevated" />
                    <div className="h-6 rounded border border-line bg-base/60" />
                    <div className="h-1.5 w-2/3 rounded bg-elevated" />
                    <div className="h-6 rounded border border-line bg-base/60" />
                    <div className="h-1.5 w-1/2 rounded bg-elevated" />
                    <div className="grid grid-cols-3 gap-1">
                      <div className="h-5 rounded bg-coral/30 border border-coral/40" />
                      <div className="h-5 rounded bg-elevated" />
                      <div className="h-5 rounded bg-elevated" />
                    </div>
                    <div className="h-1.5 rounded bg-elevated/50 mt-1" />
                    <div className="h-6 rounded border border-line bg-base/60" />
                  </div>
                </aside>
              </div>
            </div>
            <div className="mt-3 text-[11px] font-mono text-subtle uppercase tracking-wider text-center">
              // block editor preview
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
