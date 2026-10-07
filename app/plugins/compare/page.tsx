import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Compare wpaxiom plugins — Cartick, Specifico, and Axiom Blocks",
  description:
    "Compare the purpose, WordPress requirements, WooCommerce dependency, licensing, and current documentation for every wpaxiom plugin.",
  path: "/plugins/compare",
});

const PRODUCTS = [
  {
    name: "Cartick",
    version: "1.0.2",
    purpose: "Improve the WooCommerce cart experience.",
    bestFor: "Sticky add-to-cart bars, menu carts, off-canvas carts, and button labels.",
    wordpress: "5.8+",
    php: "7.4+",
    woocommerce: "Required — 6.3+",
    distribution: "Contact wpaxiom for current availability",
    href: "/plugins/cartick",
    docs: "/docs/cartick/installing-cartick",
  },
  {
    name: "Specifico",
    version: "1.0.7",
    purpose: "Create and compare structured product specifications.",
    bestFor: "Reusable specification groups, product mappings, overrides, and comparison tables.",
    wordpress: "5.8+",
    php: "7.4+",
    woocommerce: "Required — 6.3+",
    distribution: "Free on WordPress.org",
    href: "/plugins/specifico",
    docs: "/docs/specifico/installing-specifico",
  },
  {
    name: "Axiom Blocks",
    version: "1.0.8",
    purpose: "Add focused layout, content, dynamic, and conversion blocks.",
    bestFor: "Block-editor layouts, Post Grid and Filter, content components, and WooCommerce blocks.",
    wordpress: "6.0+",
    php: "7.4+",
    woocommerce: "Optional — required only for WooCommerce-specific blocks",
    distribution: "Free core on WordPress.org; optional Pro extension",
    href: "/plugins/axiom-blocks",
    docs: "/docs/axiom-blocks/installing-the-plugin",
  },
] as const;

const DECISIONS = [
  ["I want to improve add-to-cart and cart interactions", "Choose Cartick"],
  ["I need reusable product specification tables", "Choose Specifico"],
  ["I want shoppers to compare product specifications", "Choose Specifico"],
  ["I need post grids with search, taxonomy, or sorting filters", "Choose Axiom Blocks"],
  ["I need reusable content, layout, or conversion blocks", "Choose Axiom Blocks"],
] as const;

export default function PluginComparisonPage() {
  return (
    <>
      <Breadcrumb
        trail={[
          { label: "Home", href: "/" },
          { label: "Plugins", href: "/plugins" },
          { label: "Compare" },
        ]}
      />

      <section className="relative overflow-hidden border-b border-line/70">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 hero-grid" />
        <div className="relative max-w-[1280px] mx-auto px-6 py-20">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Product guide</div>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-ink max-w-4xl">
            Which wpaxiom plugin do you need?
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl">
            The three plugins solve different WordPress problems. Compare their scope and minimum
            requirements before installing anything.
          </p>
        </div>
      </section>

      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-elevated/50">
                <tr>
                  <th className="text-left px-5 py-4 text-ink font-medium">Product</th>
                  <th className="text-left px-5 py-4 text-ink font-medium">Primary purpose</th>
                  <th className="text-left px-5 py-4 text-ink font-medium">WordPress</th>
                  <th className="text-left px-5 py-4 text-ink font-medium">PHP</th>
                  <th className="text-left px-5 py-4 text-ink font-medium">WooCommerce</th>
                  <th className="text-left px-5 py-4 text-ink font-medium">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((product) => (
                  <tr key={product.name} className="border-t border-line align-top">
                    <td className="px-5 py-5">
                      <Link href={product.href} className="font-medium text-ink hover:text-coral transition">
                        {product.name}
                      </Link>
                      <div className="mt-1 text-xs font-mono text-subtle">v{product.version}</div>
                    </td>
                    <td className="px-5 py-5 text-muted max-w-[260px]">{product.purpose}</td>
                    <td className="px-5 py-5 text-muted whitespace-nowrap">{product.wordpress}</td>
                    <td className="px-5 py-5 text-muted whitespace-nowrap">{product.php}</td>
                    <td className="px-5 py-5 text-muted max-w-[220px]">{product.woocommerce}</td>
                    <td className="px-5 py-5 text-muted max-w-[240px]">{product.distribution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-line/70 bg-surface/30">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Quick decision</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Start with the job you need to do.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
            {DECISIONS.map(([need, answer]) => (
              <div key={need} className="rounded-xl border border-line bg-surface p-5 flex gap-3">
                <Check size={18} className="text-coral flex-none mt-0.5" />
                <div>
                  <p className="text-sm text-muted">{need}</p>
                  <p className="mt-1 font-medium text-ink">{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Compatibility notes</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {PRODUCTS.map((product) => (
              <article key={product.name} className="rounded-xl border border-line bg-surface p-6">
                <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{product.bestFor}</p>
                <Link href={product.docs} className="mt-5 inline-flex items-center gap-1.5 text-sm text-coral hover:text-coral-hover transition">
                  Installation requirements
                  <ArrowRight size={13} />
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm text-muted leading-relaxed">
            Requirements describe the published minimums. Theme code, extensions, and other plugins can
            still affect behavior, so test changes on a staging site before deploying them to a live store.
          </p>
        </div>
      </section>
    </>
  );
}
