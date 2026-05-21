import { Check } from "lucide-react";

const ITEMS = [
  { title: "30-day money back", caption: "no questions asked" },
  { title: "Cancel anytime", caption: "one click, from dashboard" },
  { title: "Instant license key", caption: "delivered in seconds" },
  { title: "1 year of updates", caption: "auto-update enabled" },
];

export function TrustStrip() {
  return (
    <div className="max-w-5xl mx-auto mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-xl overflow-hidden">
      {ITEMS.map((item) => (
        <div key={item.title} className="bg-base px-5 py-4 flex items-center gap-2.5">
          <Check size={18} strokeWidth={2.2} className="text-ok flex-none" />
          <div>
            <div className="text-sm text-ink">{item.title}</div>
            <div className="text-[11px] text-subtle font-mono">{item.caption}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
