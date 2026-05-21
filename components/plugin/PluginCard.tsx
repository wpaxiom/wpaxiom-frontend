import Link from "next/link";
import type { Plugin } from "@/lib/plugins";

export function PluginCard({ plugin }: { plugin: Plugin }) {
  if (plugin.highlight) {
    return <HighlightCard plugin={plugin} />;
  }
  return <StandardCard plugin={plugin} />;
}

function StandardCard({ plugin }: { plugin: Plugin }) {
  const { Icon } = plugin;
  return (
    <article className="group relative rounded-2xl border border-line bg-surface hover:border-muted/60 transition overflow-hidden flex flex-col">
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="w-11 h-11 rounded-xl bg-elevated border border-line flex items-center justify-center">
            <Icon size={20} strokeWidth={1.6} className="text-coral" />
          </div>
          <span className="px-2 py-0.5 text-[11px] rounded-md bg-elevated text-muted font-mono uppercase tracking-wider">
            {plugin.badge.label}
          </span>
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{plugin.name}</h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">{plugin.tagline}</p>
      </div>
      <div className="px-6 mt-4 pb-6 flex items-center gap-2 text-xs font-mono text-muted">
        <span>{plugin.meta}</span>
      </div>
      <div className="px-6 py-5 mt-auto border-t border-line flex items-center justify-between">
        <Link href={plugin.detailsHref} className="text-sm font-medium text-ink hover:text-coral transition">
          Plugin details →
        </Link>
        <Link
          href={plugin.installCta.href}
          className="px-3 py-1.5 rounded-md bg-elevated border border-line text-xs font-mono text-muted hover:text-ink hover:border-muted transition"
        >
          {plugin.installCta.label}
        </Link>
      </div>
    </article>
  );
}

function HighlightCard({ plugin }: { plugin: Plugin }) {
  const { Icon } = plugin;
  return (
    <article className="group relative rounded-2xl border border-coral/40 bg-gradient-to-b from-coral/[0.06] to-transparent hover:border-coral/70 transition overflow-hidden flex flex-col">
      <div className="absolute inset-x-0 top-0 h-px shimmer-line" />
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="w-11 h-11 rounded-xl bg-coral/15 border border-coral/30 flex items-center justify-center">
            <Icon size={20} strokeWidth={1.6} className="text-coral" />
          </div>
          <span className="px-2 py-0.5 text-[11px] rounded-md bg-coral/15 text-coral border border-coral/30 font-mono uppercase tracking-wider">
            {plugin.badge.label}
          </span>
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{plugin.name}</h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">{plugin.tagline}</p>
      </div>
      <div className="px-6 mt-4 flex items-center gap-2 text-xs font-mono text-muted">
        <span className="text-coral">{plugin.meta}</span>
      </div>
      <div className="px-6 py-5 mt-auto border-t border-coral/30 flex items-center justify-between">
        <Link href={plugin.detailsHref} className="text-sm font-medium text-ink hover:text-coral transition">
          Plugin details →
        </Link>
        <Link
          href={plugin.installCta.href}
          className="px-3 py-1.5 rounded-md bg-coral text-white text-xs font-medium hover:bg-coral-hover transition"
        >
          {plugin.installCta.label}
        </Link>
      </div>
    </article>
  );
}
