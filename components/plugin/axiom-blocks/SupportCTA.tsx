import { ArrowUpRight, Globe } from "lucide-react";

export function SupportCTA() {
  return (
    <section className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Get help</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Free, hosted on WordPress.org.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Axiom Blocks is a community plugin. Support lives where the WordPress community already does — on
            the public WP.org forum.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-elevated border border-line flex items-center justify-center">
              <Globe size={20} strokeWidth={1.6} className="text-ink" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted">All users</div>
              <div className="text-xl font-semibold tracking-tight text-ink">WordPress.org community</div>
            </div>
          </div>
          <p className="mt-5 text-muted leading-relaxed">
            Browse the public support forum on WP.org. Our team monitors threads daily and an active
            community contributes solutions.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-ink/85">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-coral" /> Median first reply: ~2 days
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-coral" /> Public, searchable answers
            </li>
          </ul>
          <a
            href="https://wordpress.org/support/plugin/axiom-blocks/"
            className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral"
          >
            Get support on WordPress.org
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}
