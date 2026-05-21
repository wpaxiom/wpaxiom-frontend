import { Star, ArrowUpRight } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";

export function Testimonials() {
  return (
    <section className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">
            // What people say
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl">
            Be the first to leave a review.
          </h2>
          <p className="mt-4 text-muted leading-relaxed max-w-xl">
            Our plugins are brand new. If you've tried them and found them useful, a review on
            WordPress.org goes a long way — it helps others discover the work and keeps us motivated
            to ship more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLUGINS.map((plugin) => {
            const { Icon } = plugin;
            return (
              <a
                key={plugin.slug}
                href={`${plugin.wpOrgUrl}#reviews`}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-line bg-surface hover:border-muted/60 transition p-7 flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-elevated border border-line flex items-center justify-center">
                    <Icon size={18} strokeWidth={1.6} className="text-coral" />
                  </div>
                  <ArrowUpRight size={16} strokeWidth={1.8} className="text-subtle group-hover:text-muted transition" />
                </div>
                <div className="font-semibold text-ink tracking-tight">{plugin.name}</div>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="text-line fill-line" />
                  ))}
                  <span className="ml-2 text-xs font-mono text-subtle">No reviews yet</span>
                </div>
                <div className="mt-auto pt-5 text-xs font-mono text-muted group-hover:text-ink transition">
                  Leave a review on WordPress.org →
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
