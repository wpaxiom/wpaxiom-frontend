import { Zap, Shield, Code2, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Pillar = {
  Icon: LucideIcon;
  title: string;
  body: string;
};

const PILLARS: Pillar[] = [
  {
    Icon: Zap,
    title: "Built for speed",
    body: "Sub-15kb median runtime. Zero jQuery dependencies. CSS where CSS will do.",
  },
  {
    Icon: Shield,
    title: "Hardened by default",
    body: "Every release passes WPCS, PHPStan level 8, and an external security audit each quarter.",
  },
  {
    Icon: Code2,
    title: "Developer-first",
    body: "Hooks, filters, and WP-CLI commands documented for every public surface. No black boxes.",
  },
  {
    Icon: MessageSquare,
    title: "Real human support",
    body: "Median first-response of 4 hours. The person answering wrote the code.",
  },
];

export function WhyWpaxiom() {
  return (
    <section className="border-b border-line/70 bg-surface/30">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Why wpaxiom</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">A different kind of plugin shop.</h2>
          <p className="mt-4 text-muted leading-relaxed">
            We don&apos;t ship a hundred half-finished products. We ship three, and we maintain them like
            infrastructure.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((pillar) => {
            const { Icon } = pillar;
            return (
              <div
                key={pillar.title}
                className="rounded-xl bg-surface border border-line border-t-2 border-t-coral p-6 transition duration-200 hover:-translate-y-0.5 hover:border-muted/40"
              >
                <div className="inline-flex bg-elevated border border-line p-2 rounded-lg mb-5">
                  <Icon size={18} strokeWidth={1.6} className="text-coral" />
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight text-ink">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
