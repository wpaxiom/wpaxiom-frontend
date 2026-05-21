// Client for /wpaxiom/v1/subscriptions on api.wpaxiom.com.
// Auth: Bearer JWT from session.

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export type WPAxiomSubscriptionItem = {
  product_id: number;
  variation_id: number;
  name: string;
  product_name: string | null;
  max_activations: number;
};

export type WPAxiomSubscription = {
  id: number;
  status: string;
  billing_period: string;
  billing_interval: number;
  total: number;
  currency: string;
  next_payment: string | null;
  start_date: string | null;
  payment_method: string | null;
  card_last4: string | null;
  items: WPAxiomSubscriptionItem[];
};

export async function getMySubscriptions(
  token: string
): Promise<WPAxiomSubscription[]> {
  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/subscriptions`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(
        `[wpaxiom-subscriptions] ${res.status} ${url}\n  ${body.slice(0, 200)}`
      );
      return [];
    }
    return (await res.json()) as WPAxiomSubscription[];
  } catch (error) {
    console.warn(`[wpaxiom-subscriptions] fetch failed for ${url}:`, error);
    return [];
  }
}
