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
import { PaddleCheckoutButton } from "./PaddleCheckoutButton";

type PlanMeta = {
  sitesKey: SitesKey;
  label: string;
  pillSites: string;
  features: string[];
  popular?: boolean;
};

const PLAN_META: PlanMeta[] = [
  {
    sitesKey: "1-site",
    label: "Single site",
    pillSites: "1 site",
    features: [
      "1 production site, unlimited dev",
      "All 42 Pro blocks & patterns",
      "Query Loop Pro & dynamic content",
      "Priority email support",
      "1 year of updates",
    ],
  },
  {
    sitesKey: "5-sites",
    label: "Five sites",
    pillSites: "5 sites",
    features: [
      "5 production sites, unlimited dev",
      "All 42 Pro blocks & patterns",
      "White-label mode",
      "Priority email · 4hr SLA",
      "1 year of updates",
    ],
    popular: true,
  },
  {
    sitesKey: "10-sites",
    label: "Agency",
    pillSites: "10 sites",
    features: [
      "10 production sites, unlimited dev",
      "All 42 Pro blocks & patterns",
      "White-label + agency tools",
      "Priority email · 4hr SLA",
      "1 year of updates",
    ],
  },
];

export function Plans({
  matrix,
  customerEmail,
}: {
  matrix: PriceMatrix;
  customerEmail?: string;
}) {
  const [cycle, setCycle] = useState<BillingCycle>("yearly");
  const symbol = matrix.currencySymbol;

  return (
    <section id="plans" className="border-b border-line/70">
      <div className="max-w-[1280px] mx-auto px-6 pt-12 pb-20">
        <div className="flex justify-center mb-12">
          <div
            role="radiogroup"
            aria-label="Billing cycle"
            className="inline-flex items-center p-1 rounded-full bg-surface border border-line text-sm"
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
                  ? "px-5 py-2 rounded-full bg-elevated text-ink border border-line shadow-inner inline-flex items-center gap-2"
                  : "px-5 py-2 rounded-full text-muted hover:text-ink transition inline-flex items-center gap-2"
              }
            >
              Yearly
              <span className="px-1.5 py-0.5 rounded bg-coral/20 text-coral text-[10px] font-mono uppercase tracking-wider">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto items-stretch">
          {PLAN_META.map((meta) => (
            <PlanCard
              key={meta.sitesKey}
              meta={meta}
              cycle={cycle}
              yearly={matrix.yearly[meta.sitesKey]}
              monthly={matrix.monthly[meta.sitesKey]}
              symbol={symbol}
              customerEmail={customerEmail}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  meta,
  cycle,
  yearly,
  monthly,
  symbol,
  customerEmail,
}: {
  meta: PlanMeta;
  cycle: BillingCycle;
  yearly: PlanPrice | undefined;
  monthly: PlanPrice | undefined;
  symbol: string;
  customerEmail?: string;
}) {
  const popular = meta.popular === true;
  const cardClass = popular
    ? "relative rounded-2xl border border-coral bg-surface p-7 flex flex-col shadow-2xl shadow-coral/10 md:-translate-y-2"
    : "rounded-2xl border border-line bg-surface p-7 flex flex-col";
  const labelClass = popular
    ? "text-xs font-mono uppercase tracking-wider text-coral"
    : "text-xs font-mono uppercase tracking-wider text-muted";
  const buttonClass = popular
    ? "mt-8 w-full px-4 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral"
    : "mt-8 w-full px-4 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition focus-coral";
  const pillClass = popular
    ? "px-2 py-0.5 rounded bg-coral/15 border border-coral/30 text-[10px] font-mono text-coral"
    : "px-2 py-0.5 rounded bg-elevated border border-line text-[10px] font-mono text-muted";
  const dividerClass = popular ? "mt-5 pt-5 border-t border-coral/20" : "mt-5 pt-5 border-t border-line";

  const active = cycle === "yearly" ? yearly : monthly;
  const fallbackUrl = "https://api.wpaxiom.com/product/axiom-blocks/";

  return (
    <div className={cardClass}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-coral text-white text-[10px] font-mono uppercase tracking-wider whitespace-nowrap shadow-md shadow-coral/20">
          Most popular
        </span>
      )}
      <div className="flex items-center justify-between">
        <div className={labelClass}>{meta.label}</div>
        <span className={pillClass}>{meta.pillSites}</span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <div className="text-5xl font-semibold tracking-tight text-ink">
          {active?.display ?? "—"}
        </div>
        <div className="text-muted">{cycle === "yearly" ? "/year" : "/month"}</div>
      </div>

      {cycle === "yearly" ? (
        <YearlyMeta yearly={yearly} monthly={monthly} symbol={symbol} dividerClass={dividerClass} />
      ) : (
        <MonthlyMeta yearly={yearly} dividerClass={dividerClass} />
      )}

      <ul className="mt-6 space-y-3 text-sm text-ink/90">
        {meta.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check size={16} strokeWidth={2.2} className="text-ok mt-0.5 flex-none" />
            {feature}
          </li>
        ))}
      </ul>

      {active?.paddlePriceId ? (
        <PaddleCheckoutButton
          paddlePriceId={active.paddlePriceId}
          variationId={active.variationId}
          cycle={active.cycle}
          sitesKey={active.sitesKey}
          customerEmail={customerEmail}
          className={`${buttonClass} text-center`}
        >
          Get Pro
        </PaddleCheckoutButton>
      ) : (
        <a href={active?.addToCartUrl ?? fallbackUrl} className={`${buttonClass} text-center`}>
          Get Pro
        </a>
      )}
    </div>
  );
}

function YearlyMeta({
  yearly,
  monthly,
  symbol,
  dividerClass,
}: {
  yearly: PlanPrice | undefined;
  monthly: PlanPrice | undefined;
  symbol: string;
  dividerClass: string;
}) {
  if (!yearly) return null;
  const equiv = monthlyEquivalent(yearly.amount);
  const saving = monthly ? yearlySaving(yearly.amount, monthly.amount) : null;

  return (
    <>
      <div className="mt-1.5 text-sm text-muted">that&apos;s {symbol}{formatAmount(equiv)}/mo</div>
      {saving && saving > 0 && (
        <div className="mt-1 text-sm text-ok">
          You save {symbol}
          {formatAmount(saving)} vs monthly
        </div>
      )}
      {monthly && (
        <div className={`${dividerClass} text-xs font-mono text-subtle`}>
          or {monthly.display}/mo billed monthly
        </div>
      )}
    </>
  );
}

function MonthlyMeta({
  yearly,
  dividerClass,
}: {
  yearly: PlanPrice | undefined;
  dividerClass: string;
}) {
  return (
    <>
      <div className="mt-1.5 text-sm text-muted">billed monthly</div>
      {yearly && (
        <div className={`${dividerClass} text-xs font-mono text-subtle`}>
          or {yearly.display}/yr — save more on yearly
        </div>
      )}
    </>
  );
}
