import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { getSubscriptionsForCurrentUser } from "@/lib/account-subscriptions";

export const metadata: Metadata = {
  title: "Subscriptions — wpaxiom account",
};

export default async function SubscriptionsPage() {
  const subs = await getSubscriptionsForCurrentUser();

  return (
    <>
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted mb-2">// Account</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Subscriptions</h1>
        <p className="mt-2 text-sm text-muted">
          Plans, billing, and renewals. Manage your card and cancel anytime.
        </p>
      </div>

      {subs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {subs.map((sub) => (
            <article key={sub.id} className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-elevated border border-line flex items-center justify-center flex-none">
                    <RefreshCw size={20} strokeWidth={1.7} className="text-coral" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-ink tracking-tight">{sub.pluginName}</h2>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-coral/15 text-coral border border-coral/30">
                        {sub.planLabel}
                      </span>
                      <span className="text-xs text-muted font-mono">
                        {sub.cycle === "yearly" ? "Yearly" : "Monthly"} · {sub.amount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-subtle">
                    Next renewal
                  </div>
                  <div className="text-ink mt-0.5">{sub.nextRenewal}</div>
                  {sub.paymentLast4 ? (
                    <div className="text-xs text-muted mt-1 font-mono">Card ending {sub.paymentLast4}</div>
                  ) : sub.paymentMethod ? (
                    <div className="text-xs text-muted mt-1 font-mono">{sub.paymentMethod}</div>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-line flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-muted text-ink text-sm transition focus-coral"
                >
                  Manage billing
                  <ArrowUpRight size={13} strokeWidth={2} />
                </button>
                <Link
                  href="/plugins/axiom-blocks/pricing"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-muted text-ink text-sm transition focus-coral"
                >
                  Upgrade plan
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-err/90 hover:text-err hover:bg-err/5 text-sm transition"
                >
                  Cancel subscription
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
      <div className="text-base font-medium text-ink">No active subscriptions.</div>
      <p className="mt-2 text-sm text-muted max-w-md mx-auto">
        When you purchase a Pro license, your subscription will appear here for management.
      </p>
      <Link
        href="/plugins/axiom-blocks/pricing"
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium text-sm transition focus-coral"
      >
        Browse plans
      </Link>
    </div>
  );
}
