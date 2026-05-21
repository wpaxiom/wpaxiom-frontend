import { Download, Star } from "lucide-react";

export type HeroBadge = {
  label: string;
  tone: "neutral" | "coral" | "ok";
  withDot?: boolean;
};

export type HeroCTA = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  external?: boolean;
};

type PluginHeroProps = {
  name: string;
  tagline: string;
  badges: HeroBadge[];
  rating?: string;
  reviewCount?: string;
  installs?: string;
  wpVersion: string;
  ctas: HeroCTA[];
  media?: React.ReactNode;
};

const TONE_CLASSES: Record<HeroBadge["tone"], string> = {
  neutral: "bg-elevated border-line text-muted",
  coral: "bg-coral/15 border-coral/30 text-coral",
  ok: "bg-ok/10 border-ok/25 text-ok",
};

export function PluginHero({
  name,
  tagline,
  badges,
  rating,
  reviewCount,
  installs,
  wpVersion,
  ctas,
  media,
}: PluginHeroProps) {
  const hasMedia = media !== undefined;

  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div className="absolute inset-0 hero-mesh" />
      <div className="absolute inset-0 hero-grid" />
      <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-24 lg:pt-20 lg:pb-28">
        <div className={hasMedia ? "grid lg:grid-cols-12 gap-10 items-start" : ""}>
          <div className={hasMedia ? "lg:col-span-7" : "max-w-3xl"}>
            <div className="flex items-center gap-2 flex-wrap">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono uppercase tracking-wider ${TONE_CLASSES[badge.tone]}`}
                >
                  {badge.withDot && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${badge.tone === "ok" ? "bg-ok" : badge.tone === "coral" ? "bg-coral" : "bg-muted"}`}
                    />
                  )}
                  {badge.label}
                </span>
              ))}
            </div>

            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-[72px] font-semibold tracking-[-0.03em] leading-[1] text-ink">
              {name}
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">{tagline}</p>

            <div className="mt-8 flex items-center gap-6 flex-wrap text-sm">
              {rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-coral">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="fill-coral text-coral" />
                    ))}
                  </div>
                  <span className="font-medium text-ink">{rating}</span>
                  {reviewCount && <span className="text-muted font-mono">· {reviewCount}</span>}
                </div>
              )}
              {rating && installs && <span className="text-subtle">·</span>}
              {installs && (
                <div className="flex items-center gap-2 text-muted font-mono">
                  <Download size={14} strokeWidth={1.8} />
                  <span>{installs}</span>
                </div>
              )}
              {(rating || installs) && <span className="text-subtle">·</span>}
              <span className="text-muted font-mono">{wpVersion}</span>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {ctas.map((cta) => {
                const className =
                  cta.variant === "primary"
                    ? "inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral"
                    : "inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral";
                return cta.external ? (
                  <a key={cta.label} href={cta.href} className={className}>
                    {cta.variant === "ghost" && <Download size={16} strokeWidth={1.8} />}
                    {cta.label}
                  </a>
                ) : (
                  <a key={cta.label} href={cta.href} className={className}>
                    {cta.label}
                  </a>
                );
              })}
            </div>
          </div>

          {hasMedia && <div className="lg:col-span-5 lg:mt-2">{media}</div>}
        </div>
      </div>
    </section>
  );
}
