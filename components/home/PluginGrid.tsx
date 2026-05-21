import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import { PluginCard } from "@/components/plugin/PluginCard";

export function PluginGrid() {
  return (
    <section id="plugins" className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Our plugins</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Three plugins. One philosophy.</h2>
          </div>
          <Link
            href="/plugins"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition"
          >
            Browse all <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLUGINS.map((plugin) => (
            <PluginCard key={plugin.slug} plugin={plugin} />
          ))}
        </div>
      </div>
    </section>
  );
}
