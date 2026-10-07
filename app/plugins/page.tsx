import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";
import { PluginCard } from "@/components/plugin/PluginCard";
import { PLUGINS } from "@/lib/plugins";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Plugins — wpaxiom",
  description:
    "Three tightly-scoped, open-source WordPress plugins: Cartick, Specifico, and Axiom Blocks.",
  path: "/plugins",
});

const STATS: Array<{ value: string; label: string; emphasis?: boolean }> = [
  { value: "3", label: "Focused plugins" },
  { value: "GPLv2", label: "Open-source license" },
  { value: "49", label: "Documentation guides" },
  { value: "Native", label: "WordPress foundation" },
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
            Tightly-scoped tools we maintain like infrastructure. Axiom Blocks and Specifico are available
            on WordPress.org; Cartick availability is documented on its product page.
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
          <div className="mt-10 flex justify-center">
            <Link
              href="/plugins/compare"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
            >
              Compare plugins and requirements
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
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
              Open source and publicly documented.
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-lg">
              The plugins are GPLv2. Axiom Blocks and Specifico are distributed through WordPress.org;
              Axiom Blocks also has an optional Pro extension.
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
