import type { WCVariation } from "./wp-api";

export type BillingCycle = "monthly" | "yearly";
export type SitesKey = "1-site" | "5-sites" | "10-sites";

export type PlanPrice = {
  variationId: number;
  paddlePriceId?: string; // Paddle Billing format: pri_xxx
  amount: number; // major units (e.g. 7, 59)
  display: string; // formatted with currency symbol (e.g. "$7", "$59")
  cycle: BillingCycle;
  sitesKey: SitesKey;
  addToCartUrl: string;
};

export type PriceMatrix = {
  monthly: Partial<Record<SitesKey, PlanPrice>>;
  yearly: Partial<Record<SitesKey, PlanPrice>>;
  currencySymbol: string;
};

// WC store currency is USD (set 2026-05-06). If multi-currency support is
// added later, replace this with a fetch to /wc/v3/data/currencies/current.
const STORE_CURRENCY_SYMBOL = "$";

// Used when the API call fails (network error, blocked firewall, etc).
// Mirrors the design HTML so the page still renders sensible defaults.
export const FALLBACK_MATRIX: PriceMatrix = {
  monthly: {
    "1-site": fallback(7, "monthly", "1-site"),
    "5-sites": fallback(14, "monthly", "5-sites"),
    "10-sites": fallback(21, "monthly", "10-sites"),
  },
  yearly: {
    "1-site": fallback(59, "yearly", "1-site"),
    "5-sites": fallback(119, "yearly", "5-sites"),
    "10-sites": fallback(179, "yearly", "10-sites"),
  },
  currencySymbol: STORE_CURRENCY_SYMBOL,
};

function fallback(amount: number, cycle: BillingCycle, sitesKey: SitesKey): PlanPrice {
  return {
    variationId: 0,
    amount,
    display: `${STORE_CURRENCY_SYMBOL}${formatAmount(amount)}`,
    cycle,
    sitesKey,
    // Per checkout architecture: never redirect to api.wpaxiom.com — internal
    // /checkout route owns purchases. Route doesn't exist yet (queued for
    // Phase 3). See memory: project_checkout_architecture.md.
    addToCartUrl: `/checkout?plan=${sitesKey}&cycle=${cycle}`,
  };
}

export function formatAmount(amount: number): string {
  return amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
}

// "Monthly" → "monthly", "1 Site" → "1-site", "10 Sites" → "10-sites"
function normalizeAttributeValue(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function readAttribute(variation: WCVariation, attributeName: string): string | null {
  const attr = variation.attributes.find((a) => a.name === attributeName);
  if (!attr) return null;
  return normalizeAttributeValue(attr.option);
}

function readMeta(variation: WCVariation, key: string): string | null {
  const meta = variation.meta_data?.find((m) => m.key === key);
  if (!meta || meta.value === null || meta.value === undefined) return null;
  const value = String(meta.value).trim();
  return value === "" ? null : value;
}

function isCycle(value: string | null): value is BillingCycle {
  return value === "monthly" || value === "yearly";
}

function isSitesKey(value: string | null): value is SitesKey {
  return value === "1-site" || value === "5-sites" || value === "10-sites";
}

export function buildMatrix(variations: WCVariation[]): PriceMatrix | null {
  if (variations.length === 0) return null;

  const matrix: PriceMatrix = {
    monthly: {},
    yearly: {},
    currencySymbol: STORE_CURRENCY_SYMBOL,
  };

  for (const v of variations) {
    const cycle = readAttribute(v, "Billing Cycle");
    const sitesKey = readAttribute(v, "Sites");
    if (!isCycle(cycle) || !isSitesKey(sitesKey)) continue;

    const amount = parseFloat(v.price);
    if (Number.isNaN(amount)) continue;

    const paddleRaw = readMeta(v, "paddle_plan_id");
    const paddlePriceId = paddleRaw && /^pri_[A-Za-z0-9]+$/.test(paddleRaw) ? paddleRaw : undefined;

    matrix[cycle][sitesKey] = {
      variationId: v.id,
      paddlePriceId,
      amount,
      display: `${STORE_CURRENCY_SYMBOL}${formatAmount(amount)}`,
      cycle,
      sitesKey,
      // Internal route — Next.js owns the checkout flow. WC backend is
      // called via REST from /api/checkout server-side, never via redirect.
      addToCartUrl: `/checkout?variation=${v.id}&plan=${sitesKey}&cycle=${cycle}`,
    };
  }

  return matrix;
}

export function monthlyEquivalent(yearlyAmount: number): number {
  return Math.round((yearlyAmount / 12) * 10) / 10;
}

export function yearlySaving(yearlyAmount: number, monthlyAmount: number): number {
  return Math.round((monthlyAmount * 12 - yearlyAmount) * 100) / 100;
}
