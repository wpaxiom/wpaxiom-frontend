import type { LucideIcon } from "lucide-react";

export type Feature = {
  Icon: LucideIcon;
  title: string;
  body: string;
};

type FeatureGridProps = {
  eyebrow: string;
  headline: string;
  lead?: string;
  features: Feature[];
};

export function FeatureGrid({ eyebrow, headline, lead, features }: FeatureGridProps) {
  return (
    <section className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">{eyebrow}</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">{headline}</h2>
          {lead && <p className="mt-4 text-muted leading-relaxed">{lead}</p>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const { Icon } = feature;
            return (
              <div
                key={feature.title}
                className="rounded-xl bg-surface border border-line border-t-2 border-t-coral p-6 transition duration-200 hover:-translate-y-0.5 hover:border-muted/40"
              >
                <div className="inline-flex bg-elevated border border-line p-2 rounded-lg mb-5">
                  <Icon size={18} strokeWidth={1.6} className="text-coral" />
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{feature.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
