const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

export type WCAttribute = {
  id: number;
  name: string;
  slug: string;
  position?: number;
  visible?: boolean;
  variation?: boolean;
  options?: string[];
};

export type WCProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  short_description: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  average_rating: string;
  rating_count: number;
  attributes: WCAttribute[];
  variations: number[];
};

export type WCVariationAttribute = {
  id: number;
  name: string;
  slug: string;
  option: string;
};

export type WCMetaData = {
  id: number;
  key: string;
  value: string | number | null;
};

export type WCVariation = {
  id: number;
  parent_id?: number;
  type: string;
  status: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  permalink: string;
  attributes: WCVariationAttribute[];
  meta_data?: WCMetaData[];
};

function buildAuthHeader(): string | null {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) return null;
  const token = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64");
  return `Basic ${token}`;
}

const FETCH_HEADERS_BASE: Record<string, string> = {
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (compatible; wpaxiom-frontend/1.0; +https://wpaxiom.com)",
};

async function wcFetch<T>(path: string): Promise<T | null> {
  const url = `${WORDPRESS_API_URL}/wc/v3${path}`;
  const auth = buildAuthHeader();
  if (!auth) {
    console.warn(
      "[wp-api] WC_CONSUMER_KEY / WC_CONSUMER_SECRET not configured — cannot call wc/v3"
    );
    return null;
  }
  try {
    const res = await fetch(url, {
      headers: { ...FETCH_HEADERS_BASE, Authorization: auth },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(
        `[wp-api] ${res.status} ${url}\n  first 200 chars: ${body.slice(0, 200)}`
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[wp-api] fetch failed for ${url}:`, error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const list = await wcFetch<WCProduct[]>(`/products?slug=${encodeURIComponent(slug)}`);
  return list?.[0] ?? null;
}

export async function getProductVariations(parentId: number): Promise<WCVariation[]> {
  return (await wcFetch<WCVariation[]>(`/products/${parentId}/variations?per_page=100`)) ?? [];
}

export type WCCustomer = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  date_created: string;
};

export async function getCustomerByEmail(email: string): Promise<WCCustomer | null> {
  // role=all is required: WC's /customers endpoint defaults to role=customer,
  // so an existing buyer who already has any other role (admin, shop_manager,
  // subscriber) is invisible to the default filter. That makes the processor
  // try to createCustomer, which then 400s with "email exists". Querying all
  // roles finds the existing WP user so we reuse it instead of re-creating.
  const list = await wcFetch<WCCustomer[]>(
    `/customers?email=${encodeURIComponent(email)}&per_page=1&role=all`
  );
  return list?.[0] ?? null;
}

export type CreateSubscriptionLineItem = {
  variation_id?: number;
  product_id?: number;
  quantity: number;
  total?: string;
};

export type CreateSubscriptionBody = {
  customer_id: number;
  status: "active" | "pending" | "on-hold";
  start_date: string;
  next_payment_date?: string;
  billing_period: "day" | "week" | "month" | "year";
  billing_interval: number;
  currency: string;
  payment_method?: string;
  payment_method_title?: string;
  transaction_id?: string;
  billing?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  line_items: CreateSubscriptionLineItem[];
  meta_data?: { key: string; value: string }[];
};

export type CreatedSubscription = {
  id: number;
  parent_id: number;
  status: string;
};

export type CreateSubscriptionResult =
  | { ok: true; subscription: CreatedSubscription }
  | { ok: false; status: number; body: string };

// Creates a WC Subscription via the WC Subscriptions plugin REST API. Triggers
// `woocommerce_subscription_payment_complete` which the wpaxiom-licensing plugin
// listens for to generate licenses.
export async function createSubscription(
  body: CreateSubscriptionBody
): Promise<CreateSubscriptionResult> {
  const url = `${WORDPRESS_API_URL}/wc/v3/subscriptions`;
  const auth = buildAuthHeader();
  if (!auth) {
    return { ok: false, status: 0, body: "WC credentials not configured" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...FETCH_HEADERS_BASE,
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        `[wp-api] createSubscription ${res.status} ${url}\n  first 500 chars: ${text.slice(0, 500)}`
      );
      return { ok: false, status: res.status, body: text.slice(0, 500) };
    }
    return { ok: true, subscription: (await res.json()) as CreatedSubscription };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { ok: false, status: 0, body: `fetch error: ${msg}` };
  }
}

export type WCSubscriptionListItem = {
  id: number;
  status: string;
  currency: string;
  total: string;
  next_payment_date_gmt: string; // ISO 8601 — e.g. "2026-05-20T10:24:06"
  billing: {
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: Array<{
    product_id: number;
    variation_id?: number;
    name: string;
    quantity: number;
    total: string;
  }>;
  meta_data: WCMetaData[];
};

export async function getSubscriptionById(
  id: number
): Promise<WCSubscriptionListItem | null> {
  return wcFetch<WCSubscriptionListItem>(`/subscriptions/${id}`);
}

// Lists WC subscriptions, paginated. Used by the daily renewal-reminder cron.
// Returns at most `perPage` per call; iterate via `page` parameter to walk.
export async function listSubscriptions(args: {
  status?: "active" | "on-hold" | "pending" | "cancelled" | "any";
  page?: number;
  perPage?: number;
  customerId?: number;
}): Promise<WCSubscriptionListItem[]> {
  const params = new URLSearchParams();
  params.set("status", args.status ?? "active");
  params.set("page", String(args.page ?? 1));
  params.set("per_page", String(args.perPage ?? 50));
  if (args.customerId) params.set("customer", String(args.customerId));
  return (
    (await wcFetch<WCSubscriptionListItem[]>(`/subscriptions?${params.toString()}`)) ?? []
  );
}

export async function updateSubscription(
  subscriptionId: number,
  data: { status?: string; next_payment_date?: string }
): Promise<boolean> {
  const url = `${WORDPRESS_API_URL}/wc/v3/subscriptions/${subscriptionId}`;
  const auth = buildAuthHeader();
  if (!auth) return false;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        ...FETCH_HEADERS_BASE,
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[wp-api] updateSubscription ${subscriptionId} ${res.status}: ${text.slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (e) {
    console.warn(`[wp-api] updateSubscription ${subscriptionId} failed:`, e);
    return false;
  }
}

// Updates meta on a WC subscription. Used to record renewal-reminder dedupe
// keys (e.g. "_renewal_reminder_sent_at: 2026-05-20T10:24:06") so the cron
// doesn't re-send within the same billing cycle.
export async function updateSubscriptionMeta(
  subscriptionId: number,
  meta: { key: string; value: string }[]
): Promise<boolean> {
  const url = `${WORDPRESS_API_URL}/wc/v3/subscriptions/${subscriptionId}`;
  const auth = buildAuthHeader();
  if (!auth) return false;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        ...FETCH_HEADERS_BASE,
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ meta_data: meta }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        `[wp-api] updateSubscriptionMeta ${subscriptionId} ${res.status}: ${text.slice(0, 300)}`
      );
      return false;
    }
    return true;
  } catch (e) {
    console.warn(`[wp-api] updateSubscriptionMeta ${subscriptionId} failed:`, e);
    return false;
  }
}

export type CreateCustomerBody = {
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
};

// Creates a WP user + WC customer record. WC sends a password-set email to the
// new user. If username is omitted, WC generates one from the email.
export async function createCustomer(
  body: CreateCustomerBody
): Promise<WCCustomer | null> {
  const url = `${WORDPRESS_API_URL}/wc/v3/customers`;
  const auth = buildAuthHeader();
  if (!auth) {
    console.warn("[wp-api] WC credentials not configured — cannot create customer");
    return null;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...FETCH_HEADERS_BASE,
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        `[wp-api] createCustomer ${res.status} ${url}\n  first 300 chars: ${text.slice(0, 300)}`
      );
      return null;
    }
    return (await res.json()) as WCCustomer;
  } catch (error) {
    console.warn(`[wp-api] createCustomer failed for ${url}:`, error);
    return null;
  }
}
