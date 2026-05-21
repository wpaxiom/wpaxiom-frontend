import { Plus } from "lucide-react";

export type FAQItem = {
  question: string;
  answer: React.ReactNode;
  defaultOpen?: boolean;
};

type PluginFAQProps = {
  eyebrow?: string;
  headline?: string;
  helperText?: React.ReactNode;
  items: FAQItem[];
};

export function PluginFAQ({
  eyebrow = "// FAQ",
  headline = "Common questions.",
  helperText,
  items,
}: PluginFAQProps) {
  return (
    <section className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 max-w-5xl mx-auto">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">{eyebrow}</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">{headline}</h2>
          </div>
          {helperText && (
            <p className="text-muted leading-relaxed sm:text-right max-w-sm">{helperText}</p>
          )}
        </div>

        <div className="max-w-5xl mx-auto divide-y divide-line border-y border-line">
          {items.map((item) => (
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
