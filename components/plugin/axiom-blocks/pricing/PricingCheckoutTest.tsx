"use client";

// TEMPORARY TEST PAGE — wires the Paddle checkout to verify the create-order
// webhook flow end to end. Revert pricing/page.tsx to the redirect when done.

import { useState } from "react";
import { Check } from "lucide-react";
import { PaddleCheckoutButton } from "./PaddleCheckoutButton";
import {
  type BillingCycle,
  type PriceMatrix,
  type SitesKey,
} from "@/lib/pricing";

const PLANS: { name: string; sitesKey: SitesKey; popular?: boolean }[] = [
  { name: "Single site", sitesKey: "1-site" },
  { name: "5 sites", sitesKey: "5-sites", popular: true },
  { name: "10 sites · agency", sitesKey: "10-sites" },
];

export function PricingCheckoutTest({ matrix }: { matrix: PriceMatrix }) {
  const [cycle, setCycle] = useState<BillingCycle>("yearly");
  const [email, setEmail] = useState("");

  return (
    <section className="max-w-[1100px] mx-auto px-6 py-16">
      <div className="mb-8 rounded-lg border border-coral/40 bg-coral/5 px-4 py-3 text-sm text-ink">
        <strong className="font-mono text-coral">⚠ TEMP TEST PAGE</strong> — opens a
        real Paddle checkout (sandbox if <code>NEXT_PUBLIC_PADDLE_ENV</code> ≠
        production). Completing it fires <code>transaction.completed</code> → the
        webhook creates the order, subscription &amp; license.
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-ink mb-1">
        Axiom Blocks Pro — checkout test
      </h1>
      <p className="text-sm text-muted mb-6">
        Use a test email. Enter it below to prefill, or leave blank and type it in
        the Paddle overlay.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-8">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="test@example.com (optional)"
          className="px-3 py-2 rounded-lg border border-line bg-base text-ink text-sm w-full sm:w-72 focus-coral"
        />
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
                ? "px-5 py-2 rounded-full bg-elevated text-ink border border-line"
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
                ? "px-5 py-2 rounded-full bg-elevated text-ink border border-line"
                : "px-5 py-2 rounded-full text-muted hover:text-ink transition"
            }
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const price = matrix[cycle][plan.sitesKey];
          const hasPaddle = Boolean(price?.paddlePriceId);
          return (
            <div
              key={plan.sitesKey}
              className={
                plan.popular
                  ? "rounded-2xl border border-coral bg-surface p-6 flex flex-col"
                  : "rounded-2xl border border-line bg-surface p-6 flex flex-col"
              }
            >
              <div className="text-xs font-mono uppercase tracking-wider text-muted">
                {plan.name}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-4xl font-semibold tracking-tight text-ink">
                  {price?.display ?? "—"}
                </div>
                <div className="text-muted text-sm">
                  {cycle === "yearly" ? "/year" : "/month"}
                </div>
              </div>
              <div className="mt-2 text-xs font-mono text-muted">
                variation #{price?.variationId ?? "?"}
              </div>

              <div className="mt-6">
                {hasPaddle && price ? (
                  <PaddleCheckoutButton
                    paddlePriceId={price.paddlePriceId!}
                    variationId={price.variationId}
                    cycle={cycle}
                    sitesKey={plan.sitesKey}
                    customerEmail={email || undefined}
                    className={
                      plan.popular
                        ? "w-full px-4 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition"
                        : "w-full px-4 py-3 rounded-lg border border-line hover:border-muted text-ink font-medium transition"
                    }
                  >
                    Test checkout
                  </PaddleCheckoutButton>
                ) : (
                  <div className="text-xs text-err font-mono">
                    No paddle_plan_id on this variation.
                  </div>
                )}
              </div>

              <ul className="mt-6 space-y-2 text-xs text-muted">
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-ok" /> {plan.sitesKey}
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-ok" /> {cycle}
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
