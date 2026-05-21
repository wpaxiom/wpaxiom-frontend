import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Github,
  MessageSquare,
  Globe,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";

export const metadata: Metadata = {
  title: "Contact — wpaxiom",
  description:
    "Email us, open a GitHub issue, or post on the WordPress.org forums. Median first response — 4 hours during the working week.",
};

const CHANNELS = [
  {
    Icon: Mail,
    title: "Email",
    label: "support@wpaxiom.com",
    description:
      "General questions, sales, partnerships, anything that doesn't fit a public thread.",
    cta: { label: "Send an email", href: "mailto:support@wpaxiom.com" },
    primary: true,
  },
  {
    Icon: MessageSquare,
    title: "Pro support",
    label: "Active license required",
    description:
      "Direct line to engineers via the in-dashboard beacon. Ticket attaches your license + environment automatically.",
    cta: { label: "Open a Pro ticket", href: "/account" },
    primary: true,
  },
  {
    Icon: Globe,
    title: "WordPress.org forums",
    label: "Free plugin support",
    description:
      "Public, searchable, monitored daily. Best for free-plugin questions where the answer might help others too.",
    cta: { label: "Browse forums", href: "https://wordpress.org/support/", external: true },
  },
  {
    Icon: Github,
    title: "GitHub issues",
    label: "Bug reports + feature requests",
    description:
      "If you have a reproduction or a patch, this is the fastest path. We triage daily.",
    cta: { label: "Open an issue", href: "https://github.com/wpaxiom", external: true },
  },
];

const SLA = [
  { Icon: Clock, title: "4 hour median first reply", caption: "Pro tickets, working hours" },
  { Icon: Zap, title: "Same-day fixes for regressions", caption: "Patch releases out of band" },
  { Icon: Shield, title: "No automated tier-1 queue", caption: "The reply comes from an engineer" },
];

const FAQ = [
  {
    question: "What's the fastest way to reach you?",
    answer:
      "Email if it's private or sales-related. Pro ticket if you have an active license. WP.org forum or GitHub issue if it's likely useful to others — public threads tend to get faster answers because anyone on the team can pick them up.",
  },
  {
    question: "Do you offer custom development?",
    answer:
      "We don't take on bespoke project work — we ship products. If you need something specific built into one of our plugins, file a GitHub issue with the use case. We frequently ship requested features within a release or two.",
  },
  {
    question: "Are you hiring?",
    answer:
      "Not at the moment, but we keep an open door. If you write the kind of code we ship and want to talk, email is the way.",
  },
  {
    question: "Where are you based?",
    answer:
      "Remote-first. Replies come during a roughly 9-to-9 working window split across time zones. Weekends we still triage critical issues but treat them at relaxed pace.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="relative overflow-hidden border-b border-line/70">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 hero-grid" />
        <div className="relative max-w-[1280px] mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-surface/60 text-xs text-muted font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            Median first reply: ~4 hours
          </div>
          <h1 className="mt-6 text-5xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-ink max-w-3xl mx-auto">
            Get in touch.
          </h1>
          <p className="mt-5 text-lg text-muted leading-relaxed max-w-xl mx-auto">
            Pick the channel that fits. We monitor all four — but the fastest path depends on what you
            need.
          </p>
        </div>
      </section>

      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid sm:grid-cols-2 gap-5">
            {CHANNELS.map((channel) => {
              const { Icon } = channel;
              const cardClass = channel.primary
                ? "rounded-2xl border border-coral/40 bg-gradient-to-b from-coral/[0.06] to-transparent p-7 flex flex-col"
                : "rounded-2xl border border-line bg-surface p-7 flex flex-col";
              const buttonClass = channel.primary
                ? "mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-coral hover:bg-coral-hover text-white text-sm font-medium transition focus-coral"
                : "mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-line hover:border-muted text-ink text-sm font-medium transition focus-coral";
              const iconWrap = channel.primary
                ? "w-10 h-10 rounded-lg bg-coral/15 border border-coral/30 flex items-center justify-center"
                : "w-10 h-10 rounded-lg bg-elevated border border-line flex items-center justify-center";
              const iconColor = channel.primary ? "text-coral" : "text-ink";

              return (
                <article key={channel.title} className={cardClass}>
                  <div className="flex items-center gap-3">
                    <div className={iconWrap}>
                      <Icon size={20} strokeWidth={1.6} className={iconColor} />
                    </div>
                    <div>
                      <div className="text-xl font-semibold tracking-tight text-ink">
                        {channel.title}
                      </div>
                      <div className="text-xs font-mono uppercase tracking-wider text-muted mt-0.5">
                        {channel.label}
                      </div>
                    </div>
                  </div>
                  <p className="mt-5 text-muted leading-relaxed">{channel.description}</p>
                  <div className="mt-6">
                    {channel.cta.external ? (
                      <a href={channel.cta.href} className={buttonClass}>
                        {channel.cta.label}
                        <ArrowUpRight size={14} strokeWidth={2} />
                      </a>
                    ) : (
                      <Link href={channel.cta.href} className={buttonClass}>
                        {channel.cta.label}
                        <ArrowUpRight size={14} strokeWidth={2} />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line/70 bg-surface/30">
        <div className="max-w-[1280px] mx-auto px-6 py-16">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// What to expect</div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              How we handle support, in three lines.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-line border border-line rounded-xl overflow-hidden">
            {SLA.map((item) => {
              const { Icon } = item;
              return (
                <div key={item.title} className="bg-base px-6 py-5 flex items-start gap-3">
                  <Icon size={18} strokeWidth={1.6} className="text-coral mt-0.5 flex-none" />
                  <div>
                    <div className="text-sm font-medium text-ink">{item.title}</div>
                    <div className="text-[11px] text-subtle font-mono mt-0.5">{item.caption}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Common questions before you reach out.
            </h2>
          </div>
          <div className="max-w-3xl divide-y divide-line border-y border-line">
            {FAQ.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex items-start justify-between gap-6 py-5 cursor-pointer">
                  <span className="text-base font-medium text-ink tracking-tight">{item.question}</span>
                  <span className="mt-1 flex-none w-6 h-6 rounded-md border border-line flex items-center justify-center text-muted transition-transform duration-200 group-open:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-5 -mt-1 text-sm text-muted leading-relaxed max-w-2xl">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
