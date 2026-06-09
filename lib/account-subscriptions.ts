import { auth } from "./auth";
import {
  getMySubscriptions,
  type WPAxiomSubscription,
} from "./wpaxiom-subscriptions";

export type Subscription = {
  id: string;
  wcSubId: number;
  pluginName: string;
  planLabel: string;
  cycle: "monthly" | "yearly" | "other";
  amount: string;
  nextRenewal: string;
  paymentLast4: string | null;
  paymentMethod: string | null;
  status: "active" | "cancelled" | "past_due" | "on_hold" | "expired" | "pending";
};

function planLabelForMaxSites(max: number): string {
  if (!max) return "—";
  if (max === 1) return "Single · 1 site";
  if (max === 5) return "Business · 5 sites";
  if (max === 10) return "Agency · 10 sites";
  return `${max} sites`;
}

function formatAmount(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function deriveCycle(period: string): Subscription["cycle"] {
  if (period === "year") return "yearly";
  if (period === "month") return "monthly";
  return "other";
}

function deriveStatus(status: string): Subscription["status"] {
  switch (status) {
    case "active":
    case "cancelled":
    case "expired":
    case "pending":
      return status as Subscription["status"];
    case "on-hold":
      return "on_hold";
    case "pending-cancel":
      return "cancelled";
    default:
      return "active";
  }
}

function mapSubscription(sub: WPAxiomSubscription): Subscription {
  const firstItem = sub.items[0];
  return {
    id: `sub-${sub.id}`,
    wcSubId: sub.id,
    pluginName: firstItem?.product_name ?? `Subscription #${sub.id}`,
    planLabel: planLabelForMaxSites(firstItem?.max_activations ?? 0),
    cycle: deriveCycle(sub.billing_period),
    amount: formatAmount(sub.total, sub.currency),
    nextRenewal: formatDate(sub.next_payment),
    paymentLast4: sub.card_last4,
    paymentMethod: sub.payment_method,
    status: deriveStatus(sub.status),
  };
}

export async function getSubscriptionsForCurrentUser(): Promise<Subscription[]> {
  const session = await auth();
  const token = session?.user?.wpToken;
  if (!token) return [];
  const subs = await getMySubscriptions(token);
  return subs.map(mapSubscription);
}
