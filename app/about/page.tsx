import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers, Microscope, GitPullRequest, Heart } from "lucide-react";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";
import { SITE_STATS, WP_PROFILE_URL } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About — wpaxiom",
  description:
    "wpaxiom builds tightly-scoped WordPress plugins for developers who care about query count, bundle size, and the next ten years of the platform.",
};

const PRINCIPLES = [
  {
    Icon: Layers,
    title: "Scope over scale",
    body: "Three plugins. Maintained like infrastructure. We will not ship a hundredth product to compete on a feature list.",
  },
  {
    Icon: Microscope,
    title: "Measured, not assumed",
    body: "Every release ships with PHPStan level 8, an external security audit each quarter, and load-tested benchmarks published in the changelog.",
  },
  {
    Icon: GitPullRequest,
    title: "Open by default",
    body: "Source on GitHub, GPLv2 forever, free tiers on WordPress.org. Pro is what funds the maintenance — not the access.",
  },
  {
    Icon: Heart,
    title: "Real human support",
    body: "The person who replies to your support thread wrote the code. Median first response: four hours. No tier-1 outsourced ticket queue.",
  },
];


export default function AboutPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <section className="relative overflow-hidden border-b border-line/70">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 hero-grid" />
        <div className="relative max-w-[1280px] mx-auto px-6 pt-20 pb-20">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// About</div>
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-semibold tracking-[-0.03em] leading-[1.05] text-ink max-w-3xl">
            We ship three plugins.
            <span className="block text-muted">We maintain them like infrastructure.</span>
          </h1>
          <p className="mt-8 text-lg text-muted leading-relaxed max-w-2xl">
            wpaxiom is a small WordPress plugin shop with an unfashionable opinion: most stores ship too
            many plugins, half-finished, optimised for the catalog page rather than the people who install
            them. We do the opposite.
          </p>
        </div>
      </section>

      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Manifesto</div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.1]">
                The unfashionable opinion.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-5 text-[17px] text-ink/90 leading-relaxed">
              <p>
                A typical WordPress plugin shop sells 40 products. They cross-sell, they bundle, they push
                a Pro tier with quarterly feature drops to keep MRR up. The plugins themselves drift —
                touched once a year, loaded with code that forgot its own author.
              </p>
              <p>
                We thought there was a better way to do this, so we set out to do it. Cartick, Specifico,
                and Axiom Blocks are the result: tightly scoped, exhaustively tested, maintained like the
                infrastructure they actually are when 120,000 sites depend on you.
              </p>
              <p>
                We do not have a roadmap with 60 items. We have one with three. We push releases when the
                code is ready and the tests are green, not when a launch calendar says we should. If that
                sounds slow, we are okay with that.
              </p>
              <p className="text-muted">
                If you write WordPress for a living and you care about query count, bundle size, and the
                next ten years of the platform — we built this for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line/70 bg-surface/30">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Principles</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              How we decide what to ship.
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Four rules we have been unwilling to compromise. They have cost us features and customers.
              We are okay with that.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRINCIPLES.map((p) => {
              const { Icon } = p;
              return (
                <div
                  key={p.title}
                  className="rounded-xl bg-surface border border-line border-t-2 border-t-coral p-6 transition duration-200 hover:-translate-y-0.5 hover:border-muted/40"
                >
                  <div className="inline-flex bg-elevated border border-line p-2 rounded-lg mb-5">
                    <Icon size={18} strokeWidth={1.6} className="text-coral" />
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Today</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Where the numbers are right now.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line/70 border border-line rounded-xl overflow-hidden bg-surface/40">
            {SITE_STATS.map((stat) => (
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

      <section className="border-b border-line/70 bg-surface/30">
        <div className="max-w-[1280px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Get involved</div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Three plugins, one philosophy. Try them, read the code, file an issue.
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-lg">
              All of our work ships under GPLv2 on WordPress.org. The source is on GitHub. We answer issues
              the same week we get them.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/plugins"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral"
            >
              Explore the plugins
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <a
              href="https://github.com/wpaxiom"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
            >
              GitHub
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
            <a
              href={WP_PROFILE_URL}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
            >
              WordPress.org
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
