import { Plus } from "lucide-react";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
  defaultOpen?: boolean;
};

const ITEMS: FAQItem[] = [
  {
    question: "What blocks are included?",
    answer:
      "Tabs, accordion, countdown timer, before/after slider, pricing table, star rating, shape divider, device visibility, reading progress bar, trust badges, free shipping progress, and copy-to-clipboard — 12 blocks in total.",
    defaultOpen: true,
  },
  {
    question: "Will it slow my site down?",
    answer:
      "No. Each block ships its own scoped CSS and JS, loaded only on pages that use it. Median frontend payload is under 14kb gzipped.",
  },
  {
    question: "Does it work with my theme?",
    answer:
      "If your theme supports the block editor, yes. Axiom Blocks reads your theme.json — colors, spacing, fonts — so blocks inherit your existing design tokens without hard-coded styles.",
  },
  {
    question: "Does it work with classic themes?",
    answer:
      "Yes. All blocks render correctly in classic themes. Theme.json integration is progressive enhancement — blocks look good without it, even better with it.",
  },
  {
    question: "Is it free forever?",
    answer:
      "Yes. The plugin is GPL-licensed, hosted on WordPress.org, and has no usage limits or nag screens.",
  },
];

export function FAQ() {
  return (
    <section className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 max-w-5xl mx-auto">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Common questions.</h2>
          </div>
          <p className="text-muted leading-relaxed sm:text-right max-w-sm">
            Don&apos;t see yours?{" "}
            <a href="mailto:support@wpaxiom.com" className="text-ink underline-offset-4 hover:underline">
              Email us
            </a>{" "}
            — a real human responds within 4 hours.
          </p>
        </div>

        <div className="max-w-5xl mx-auto divide-y divide-line border-y border-line">
          {ITEMS.map((item) => (
            <details key={item.question} className="group" open={item.defaultOpen}>
              <summary className="flex items-start justify-between gap-6 py-6">
                <span className="text-lg font-medium text-ink tracking-tight">{item.question}</span>
                <span className="mt-1.5 flex-none w-6 h-6 rounded-md border border-line flex items-center justify-center text-muted transition-transform duration-200 group-open:rotate-45">
                  <Plus size={14} strokeWidth={2} />
                </span>
              </summary>
              <div className="pb-6 -mt-1 text-muted leading-relaxed max-w-2xl">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
