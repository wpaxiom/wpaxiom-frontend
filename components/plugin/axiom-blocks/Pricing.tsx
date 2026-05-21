"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  formatAmount,
  monthlyEquivalent,
  yearlySaving,
  type BillingCycle,
  type PlanPrice,
  type PriceMatrix,
  type SitesKey,
} from "@/lib/pricing";

type PlanMeta = {
  name: string;
  sitesKey: SitesKey;
  features: string[];
  cta: string;
  popular?: boolean;
};

const PLANS: PlanMeta[] = [
  {
    name: "Single site",
    sitesKey: "1-site",
    features: [
      "1 production site",
      "Unlimited dev/staging",
      "All Pro blocks & features",
      "Priority email support",
      "1 year of updates",
    ],
    cta: "Choose Single",
  },
  {
    name: "5 sites",
    sitesKey: "5-sites",
    features: [
      "5 production sites",
      "Unlimited dev/staging",
      "All Pro blocks & features",
      "Priority email · 4hr SLA",
      "White-label mode",
    ],
    cta: "Choose 5 sites",
    popular: true,
  },
  {
    name: "10 sites · agency",
    sitesKey: "10-sites",
    features: [
      "10 production sites",
      "Unlimited dev/staging",
      "All Pro blocks & features",
      "Priority email · 4hr SLA",
      "White-label + agency tools",
    ],
    cta: "Choose 10 sites",
  },
];

type Cycle = BillingCycle;

export function Pricing({ matrix }: { matrix: PriceMatrix }) {
  const [cycle, setCycle] = useState<Cycle>("yearly");

  return (
    <section id="pricing" className="border-b border-line/70 relative overflow-hidden">
      <div className="absolute inset-0 hero-mesh opacity-60" />
      <div className="relative max-w-[1280px] mx-auto px-6 py-24">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Pricing</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Simple, transparent pricing.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Two decisions: how many sites, monthly or yearly. Cancel anytime, 30-day refund, instant license
            key.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Billing cycle"
          className="inline-flex items-center p-1 rounded-full bg-base border border-line text-sm"
        >
          <button
            type="button"
            role="radio"
            aria-checked={cycle === "monthly"}
            onClick={() => setCycle("monthly")}
            className={
              cycle === "monthly"
                ? "px-5 py-2 rounded-full bg-elevated text-ink border border-line shadow-inner"
                : "px-5 py-2 rounded-full text-muted hover:text-ink transition"
            }
          >
            Monthly
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={cycle === "yearly"}
            onClick={() => setCycle("yearly")}
            className={
              cycle === "yearly"
                ? "px-5 py-2 rounded-full bg-elevated text-ink border border-line shadow-inner"
                : "px-5 py-2 rounded-full text-muted hover:text-ink transition"
            }
          >
            Yearly{" "}
            <span className="ml-1.5 text-coral text-xs font-mono">SAVE 30%</span>
          </button>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              cycle={cycle}
              yearly={matrix.yearly[plan.sitesKey]}
              monthly={matrix.monthly[plan.sitesKey]}
              symbol={matrix.currencySymbol}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>Payments by</span>
            <span className="px-3 py-1.5 rounded-md bg-elevated border border-line text-ink text-sm font-medium">Paddle</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted">
            <span className="flex items-center gap-1.5">
              <Check size={12} strokeWidth={2.4} className="text-ok" /> 30-day refund
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={12} strokeWidth={2.4} className="text-ok" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={12} strokeWidth={2.4} className="text-ok" /> Instant license key
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  cycle,
  yearly,
  monthly,
  symbol,
}: {
  plan: PlanMeta;
  cycle: Cycle;
  yearly: PlanPrice | undefined;
  monthly: PlanPrice | undefined;
  symbol: string;
}) {
  const popular = plan.popular === true;
  const cardClass = popular
    ? "relative rounded-2xl border border-coral bg-surface p-7 flex flex-col shadow-2xl shadow-coral/10"
    : "rounded-2xl border border-line bg-surface p-7 flex flex-col";
  const labelClass = popular
    ? "text-xs font-mono uppercase tracking-wider text-coral"
    : "text-xs font-mono uppercase tracking-wider text-muted";
  const buttonClass = popular
    ? "mt-8 w-full px-4 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition text-center"
    : "mt-8 w-full px-4 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition text-center";

  const active = cycle === "yearly" ? yearly : monthly;

  return (
    <div className={cardClass}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-coral text-white text-[10px] font-mono uppercase tracking-wider whitespace-nowrap shadow-md shadow-coral/20">
          Most popular
        </span>
      )}
      <div className={labelClass}>{plan.name}</div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-5xl font-semibold tracking-tight text-ink">{active?.display ?? "—"}</div>
        <div className="text-muted">{cycle === "yearly" ? "/year" : "/month"}</div>
      </div>
      {cycle === "yearly" && yearly ? (
        <>
          <div className="mt-1 text-sm text-muted">
            that&apos;s {symbol}
            {formatAmount(monthlyEquivalent(yearly.amount))}/mo
          </div>
          {monthly && (
            <div className="mt-1 text-sm text-ok">
              You save {symbol}
              {formatAmount(yearlySaving(yearly.amount, monthly.amount))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-1 text-sm text-muted">billed monthly</div>
      )}
      <ul className="mt-7 space-y-3 text-sm text-ink/90">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check size={16} strokeWidth={2.2} className="text-ok mt-0.5 flex-none" />
            {feature}
          </li>
        ))}
      </ul>
      <a href={active?.addToCartUrl ?? "/plugins/axiom-blocks/pricing"} className={buttonClass}>
        {plan.cta}
      </a>
    </div>
  );
}
