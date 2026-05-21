import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";
import { PluginCard } from "@/components/plugin/PluginCard";
import { PLUGINS } from "@/lib/plugins";

export const metadata: Metadata = {
  title: "Plugins — wpaxiom",
  description:
    "Three tightly-scoped WordPress plugins: Cartick, Specifico, and Axiom Blocks. Free on WP.org, with a paid Pro tier where it makes sense.",
};

const STATS = [
  { value: "120,400+", label: "Active installs" },
  { value: "4.92★", label: "Avg WP.org rating", emphasis: true },
  { value: "<14kb", label: "Median JS payload" },
  { value: "99 / 100", label: "PageSpeed mobile" },
];

export default function PluginsListingPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Plugins" }]} />

      <section className="relative overflow-hidden border-b border-line/70">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 hero-grid" />
        <div className="relative max-w-[1280px] mx-auto px-6 pt-20 pb-16">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Plugins</div>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-ink max-w-3xl">
            Three plugins.
            <span className="block text-muted">One philosophy.</span>
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
            Tightly-scoped tools we maintain like infrastructure. Each one is free on WordPress.org. Pro tiers
            exist only where there&apos;s real, ongoing work behind them.
          </p>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-line/70 border border-line rounded-xl overflow-hidden bg-surface/40">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-base/60 px-6 py-5">
                <div className="text-2xl font-semibold tracking-tight text-ink">
                  {stat.emphasis ? (
                    <>
                      {stat.value.replace("★", "")}
                      <span className="text-coral">★</span>
                    </>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-xs text-muted mt-1 font-mono uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-5">
            {PLUGINS.map((plugin) => (
              <PluginCard key={plugin.slug} plugin={plugin} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line/70 bg-surface/30">
        <div className="max-w-[1280px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">
              // Open source
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Free, audited, and on WordPress.org.
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-lg">
              Every plugin we ship is GPLv2 and available without a single sign-up. The Pro tier on Axiom
              Blocks pays for the maintenance — not the access.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="https://profiles.wordpress.org/wpaxiom/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
            >
              View us on WordPress.org
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
            <a
              href="https://github.com/wpaxiom"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
            >
              GitHub
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
