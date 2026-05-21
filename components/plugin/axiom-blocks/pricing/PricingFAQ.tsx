import { Plus } from "lucide-react";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
  defaultOpen?: boolean;
};

const ITEMS: FAQItem[] = [
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. Upgrade at any time from your account dashboard — you'll only be charged the prorated difference for the remainder of your billing period. Downgrades take effect at the next renewal.",
    defaultOpen: true,
  },
  {
    question: "What happens when my subscription renews?",
    answer:
      "Your card is charged automatically on the renewal date at the same plan and price you signed up for. We email a reminder 14 days in advance and never silently raise prices.",
  },
  {
    question: "Do you offer refunds?",
    answer: (
      <>
        Full refund within 30 days, no questions asked. Email{" "}
        <span className="font-mono text-ink">support@wpaxiom.com</span> with your order ID and we&apos;ll
        process it the same business day.
      </>
    ),
  },
  {
    question: "Which payment method should I choose?",
    answer:
      "If you're in the US, EU, or UK and want the fastest checkout (including Apple Pay), pick Stripe. If you're outside those regions or need invoices that include VAT for your local tax authority, pick FastSpring — they act as the merchant of record and handle the paperwork.",
  },
];

export function PricingFAQ() {
  return (
    <section className="border-b border-line/70 bg-surface/30">
      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">
            // Quick answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Common pricing questions.
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-line border-y border-line">
          {ITEMS.map((item) => (
            <details key={item.question} className="group" open={item.defaultOpen}>
              <summary className="flex items-start justify-between gap-6 py-6">
                <span className="text-base font-medium text-ink tracking-tight">{item.question}</span>
                <span className="mt-1 flex-none w-6 h-6 rounded-md border border-line flex items-center justify-center text-muted transition-transform duration-200 group-open:rotate-45">
                  <Plus size={14} strokeWidth={2} />
                </span>
              </summary>
              <div className="pb-6 -mt-1 text-sm text-muted leading-relaxed">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
