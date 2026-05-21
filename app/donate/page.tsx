"use client";

import { useState } from "react";
import { Coffee } from "lucide-react";
import { openPaddleCheckout } from "@/lib/paddle";

const TIERS = [
  {
    priceId: "pri_01ks4azfg9nf7mc10hdjsm53zk",
    amount: "$5",
    label: "A coffee",
    description: "A quick espresso to keep the code flowing.",
  },
  {
    priceId: "pri_01ks4b14bdyjtsqkn6ntexmxdc",
    amount: "$10",
    label: "A couple of coffees",
    description: "Fuel for a full afternoon of plugin work.",
    popular: true,
  },
  {
    priceId: "pri_01ks4b3dgwewyc7edp16bgqv9q",
    amount: "$20",
    label: "A bag of coffee",
    description: "Keeps the whole week going. Deeply appreciated.",
  },
];

function DonateButton({ priceId, children }: { priceId: string; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      await openPaddleCheckout({
        priceId,
        customData: { source: "donate-page" },
        onEvent: (event) => {
          if (event.name === "checkout.closed") setBusy(false);
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
        className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Coffee size={16} strokeWidth={1.8} />
        {busy ? "Opening checkout…" : children}
      </button>
      {error && <p className="mt-2 text-xs text-err font-mono text-center">{error}</p>}
    </>
  );
}

export default function DonatePage() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-24">
      <div className="max-w-2xl mb-16">
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Support the work</div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
          Buy me a coffee
        </h1>
        <p className="mt-5 text-lg text-muted leading-relaxed">
          wpaxiom plugins are free and open source. If they&apos;ve saved you time, a coffee keeps
          the development going. No subscription, no account required.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        {TIERS.map((tier) => (
          <div
            key={tier.priceId}
            className={`relative rounded-xl border bg-surface p-8 flex flex-col ${
              tier.popular
                ? "border-coral/50 border-t-2 border-t-coral"
                : "border-line border-t-2 border-t-line"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-coral text-white text-[11px] font-mono uppercase tracking-wider">
                Popular
              </span>
            )}
            <div className="text-5xl font-semibold tracking-tight text-ink">{tier.amount}</div>
            <div className="mt-2 text-sm font-medium text-coral">{tier.label}</div>
            <p className="mt-4 text-sm text-muted leading-relaxed flex-1">{tier.description}</p>
            <DonateButton priceId={tier.priceId}>Support with {tier.amount}</DonateButton>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-subtle font-mono">
        Payments processed securely by Paddle. No account required.
      </p>
    </section>
  );
}
