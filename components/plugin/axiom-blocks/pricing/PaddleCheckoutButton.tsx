"use client";

import { useState } from "react";
import { openPaddleCheckout } from "@/lib/paddle";

type Props = {
  paddlePriceId: string;
  variationId: number;
  cycle: "monthly" | "yearly";
  sitesKey: string;
  customerEmail?: string;
  className?: string;
  children: React.ReactNode;
};

export function PaddleCheckoutButton({
  paddlePriceId,
  variationId,
  cycle,
  sitesKey,
  customerEmail,
  className,
  children,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      await openPaddleCheckout({
        priceId: paddlePriceId,
        email: customerEmail || undefined,
        customData: {
          source: "pricing-page",
          wc_variation_id: variationId,
          cycle,
          sites_key: sitesKey,
        },
        onEvent: (event) => {
          if (event.name === "checkout.completed") {
            window.location.href = "/account/licenses?welcome=1";
          } else if (event.name === "checkout.closed") {
            setBusy(false);
          }
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open checkout.");
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={className}
      >
        {busy ? "Opening checkout…" : children}
      </button>
      {error && (
        <div className="mt-2 text-xs text-err font-mono text-center">{error}</div>
      )}
    </>
  );
}
