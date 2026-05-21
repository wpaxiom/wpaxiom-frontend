import { Star } from "lucide-react";

export type Quote = {
  body: string;
  name: string;
  role: string;
};

type PluginTestimonialsProps = {
  eyebrow?: string;
  headline: string;
  rating?: string;
  reviewCount?: string;
  quotes: Quote[];
  background?: "surface" | "base";
};

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

export function PluginTestimonials({
  eyebrow = "// What people say",
  headline,
  rating,
  reviewCount,
  quotes,
  background = "surface",
}: PluginTestimonialsProps) {
  const sectionClass =
    background === "surface" ? "border-b border-line/70 bg-surface/30" : "border-b border-line/70";
  const figureBg = background === "surface" ? "bg-base" : "bg-surface";

  return (
    <section className={sectionClass}>
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">{eyebrow}</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink max-w-2xl">
              {headline}
            </h2>
          </div>
          {rating && reviewCount && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-muted">
              <Star size={12} className="fill-coral text-coral" />
              {rating} from {reviewCount} reviews
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((quote) => (
            <figure key={quote.name} className={`rounded-2xl border border-line ${figureBg} p-7`}>
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
