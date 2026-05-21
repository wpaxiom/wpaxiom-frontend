import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHANGELOG } from "@/lib/changelog-data";
import { SITE_STATS, WP_PROFILE_URL } from "@/lib/site-data";

function WordPressIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96.24 96.24" fill="currentColor" aria-hidden="true">
      <path d="M48.122,0C21.587,0,0.001,21.585,0.001,48.118c0,26.535,21.587,48.122,48.12,48.122c26.532,0,48.117-21.587,48.117-48.122C96.239,21.586,74.654,0,48.122,0z M4.857,48.118c0-6.271,1.345-12.227,3.746-17.606l20.638,56.544C14.81,80.042,4.857,65.243,4.857,48.118z M48.122,91.385c-4.247,0-8.346-0.623-12.222-1.763L48.88,51.903l13.301,36.433c0.086,0.215,0.191,0.411,0.308,0.596C57.992,90.514,53.16,91.385,48.122,91.385z M54.083,27.834c2.604-0.137,4.953-0.412,4.953-0.412c2.33-0.276,2.057-3.701-0.277-3.564c0,0-7.007,0.549-11.532,0.549c-4.25,0-11.396-0.549-11.396-0.549c-2.332-0.137-2.604,3.427-0.273,3.564c0,0,2.208,0.275,4.537,0.412l6.74,18.469l-9.468,28.395L21.615,27.835c2.608-0.136,4.952-0.412,4.952-0.412c2.33-0.275,2.055-3.702-0.278-3.562c0,0-7.004,0.549-11.53,0.549c-0.813,0-1.77-0.021-2.784-0.052C19.709,12.611,33.008,4.856,48.122,4.856c11.265,0,21.519,4.306,29.215,11.357c-0.187-0.01-0.368-0.035-0.562-0.035c-4.248,0-7.264,3.702-7.264,7.679c0,3.564,2.055,6.582,4.248,10.146c1.647,2.882,3.567,6.585,3.567,11.932c0,3.704-1.422,8-3.293,13.986l-4.315,14.421L54.083,27.834z M69.871,85.516l13.215-38.208c2.471-6.171,3.29-11.106,3.29-15.497c0-1.591-0.104-3.07-0.292-4.449c3.38,6.163,5.303,13.236,5.301,20.758C91.384,64.08,82.732,78.016,69.871,85.516z" />
    </svg>
  );
}

const latestEntry = CHANGELOG.find((e) => e.latest)

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div className="absolute inset-0 hero-mesh" />
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute inset-0 hero-dots" />
      <div className="hidden lg:block absolute -right-32 top-24 w-[520px] h-[520px] opacity-[0.07] rotate-12">
        <div className="chev-mark w-full h-full" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 pt-24 pb-28 lg:pt-32 lg:pb-36">
        {latestEntry && (
          <Link
            href="/changelog"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-surface/60 text-xs text-muted font-mono hover:border-muted transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            v{latestEntry.version} — {latestEntry.summary}
            <span className="text-subtle">·</span>
            <span className="text-ink/80">read changelog</span>
          </Link>
        )}

        <h1 className="mt-6 text-5xl sm:text-6xl lg:text-[88px] font-semibold tracking-[-0.035em] leading-[0.95] max-w-5xl">
          WordPress plugins,
          <span className="block text-muted">built with precision.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg text-muted leading-relaxed">
          Three plugins. Zero bloat. wpaxiom builds tightly-scoped tools for developers who care about query
          count, bundle size, and the next ten years of WordPress.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="#plugins"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral"
          >
            Explore plugins
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <a
            href={WP_PROFILE_URL}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
          >
            <WordPressIcon size={16} />
            View on WordPress.org
          </a>
          <span className="ml-2 text-sm text-subtle font-mono hidden sm:inline">
            free to install · no jQuery · no bloat
          </span>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-line/70 border border-line rounded-xl overflow-hidden bg-surface/40">
          {SITE_STATS.map((stat) => (
            <div key={stat.label} className="bg-base/60 px-6 py-5">
              <div className="text-2xl font-semibold tracking-tight">
                {stat.emphasis ? (
                  <>
                    {stat.value.replace("★", "")}
                    <span className="text-coral">★</span>
                  </>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-xs text-muted mt-1 font-mono uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
