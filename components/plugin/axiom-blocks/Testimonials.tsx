import { Star } from "lucide-react";

type Quote = {
  body: string;
  name: string;
  role: string;
};

const QUOTES: Quote[] = [
  {
    body: "Replaced four plugins with Axiom Blocks. Page weight dropped 38%, build time halved. The Query Loop alone is worth the license.",
    name: "Marta Reyes",
    role: "Lead engineer · Aperture Studio",
  },
  {
    body: "Conditional visibility plus dynamic binding turned a six-week build into two. I no longer ship custom blocks for any client under 100k traffic.",
    name: "Kenji Sato",
    role: "Solo developer · sato.studio",
  },
  {
    body: "Support is unreal. Replied at 11pm on a Friday with a working patch. Most plugin shops can't manage that in three business days.",
    name: "Esme Holloway",
    role: "Tech lead · Beacon Digital",
  },
];

function QuoteMark() {
  return (
    <svg
      className="text-coral mb-5"
      width="22"
      height="18"
      viewBox="0 0 24 18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 18V9.7C0 4.4 3.5.4 9 0v3.6C5.7 4.2 4 6.2 4 9.6h4V18H0Zm14 0V9.7C14 4.4 17.5.4 23 0v3.6c-3.3.6-5 2.6-5 6h4v8.4h-8Z" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section className="border-b border-line/70 bg-surface/30">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">
              // What people say
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink max-w-2xl">
              From the people shipping with it every day.
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-muted">
            <Star size={12} className="fill-coral text-coral" />
            4.9 from 1,247 reviews
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {QUOTES.map((quote) => (
            <figure key={quote.name} className="rounded-2xl border border-line bg-base p-7">
              <QuoteMark />
              <blockquote className="text-ink/95 leading-relaxed text-[15px]">{quote.body}</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-line text-sm">
                <div className="font-medium text-ink">{quote.name}</div>
                <div className="text-muted">{quote.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
