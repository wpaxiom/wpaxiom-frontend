"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";

type Props = {
  wcSubId: number;
  status: string;
};

export function SubscriptionActions({ wcSubId, status }: Props) {
  const router = useRouter();
  const [portalBusy, setPortalBusy] = useState(false);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInactive = status === "cancelled" || status === "expired";
  const isCancellable = status === "active" || status === "on_hold";

  async function handleManageBilling() {
    setPortalBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/subscriptions/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not open billing portal");
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open billing portal");
    } finally {
      setPortalBusy(false);
    }
  }

  async function handleCancel() {
    setCancelBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/subscriptions/${wcSubId}/cancel`, { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not cancel subscription");
      setConfirmCancel(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel subscription");
      setCancelBusy(false);
    }
  }

  // Cancelled / expired: show resubscribe prompt only
  if (isInactive) {
    return (
      <div className="mt-6 pt-5 border-t border-line flex flex-wrap gap-2 items-center">
        <p className="text-sm text-muted mr-2">
          {status === "cancelled" ? "Your subscription has been cancelled." : "Your subscription has expired."}
        </p>
        <Link
          href="/plugins/axiom-blocks/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium text-sm transition focus-coral"
        >
          Resubscribe
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-5 border-t border-line flex flex-wrap gap-2 items-center">
      <button
        type="button"
        onClick={handleManageBilling}
        disabled={portalBusy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-muted text-ink text-sm transition focus-coral disabled:opacity-60"
      >
        {portalBusy ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <ArrowUpRight size={13} strokeWidth={2} />
        )}
        Manage billing
      </button>

      <Link
        href="/plugins/axiom-blocks/pricing"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-muted text-ink text-sm transition focus-coral"
      >
        Upgrade plan
      </Link>

      {isCancellable && !confirmCancel && (
        <button
          type="button"
          onClick={() => { setError(null); setConfirmCancel(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-err/90 hover:text-err hover:bg-err/5 text-sm transition"
        >
          Cancel subscription
        </button>
      )}

      {confirmCancel && (
        <>
          <span className="text-sm text-muted">Cancel at end of billing period?</span>
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelBusy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-err text-white text-sm font-medium transition hover:bg-err/90 disabled:opacity-60"
          >
            {cancelBusy && <Loader2 size={13} className="animate-spin" />}
            Confirm cancel
          </button>
          <button
            type="button"
            onClick={() => setConfirmCancel(false)}
            disabled={cancelBusy}
            className="px-4 py-2 rounded-lg text-muted text-sm hover:text-ink transition"
          >
            Never mind
          </button>
        </>
      )}

      {error && (
        <p className="w-full text-xs text-err font-mono mt-1">{error}</p>
      )}
    </div>
  );
}
