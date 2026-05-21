import { LayoutGrid, Palette, Eye, Zap, Box, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  Icon: LucideIcon;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    Icon: LayoutGrid,
    title: "12 production-ready blocks",
    body: "Tabs, accordion, countdown timer, before/after slider, pricing table, star rating, trust badges, free shipping progress, and more.",
  },
  {
    Icon: Box,
    title: "Block patterns library",
    body: "20 ready-to-use layout patterns for landing pages, feature sections, and pricing layouts. One click to insert, fully editable.",
  },
  {
    Icon: Palette,
    title: "Theme.json native",
    body: "Reads your theme's colors, spacing, and font scales. Blocks inherit your design tokens without hard-coded styles.",
  },
  {
    Icon: Eye,
    title: "WCAG AA accessible",
    body: "Proper ARIA roles, keyboard navigation, focus management, and screen-reader announcements on every interactive block.",
  },
  {
    Icon: Zap,
    title: "Per-block asset loading",
    body: "Each block ships its own scoped CSS and JS, loaded only on pages that use it. Median frontend payload under 14 kb gzipped.",
  },
  {
    Icon: ShieldCheck,
    title: "Auto-updates via WP.org",
    body: "Hosted on WordPress.org. Updates arrive in your dashboard like any other plugin — no license key, no activation step.",
  },
];

export function FeatureGrid() {
  return (
    <section className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Capabilities</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            The blocks the editor was missing.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Twelve blocks, twenty patterns, zero jQuery. Everything ships in a single free plugin from WordPress.org.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
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
