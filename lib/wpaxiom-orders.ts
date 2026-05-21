// Client for WooCommerce /wc/v3/orders on api.wpaxiom.com.
// Auth: Basic auth with WC_CONSUMER_KEY:WC_CONSUMER_SECRET.

import { getCustomerByEmail } from "./wp-api";

export type WCOrder = {
  id: number;
  number: string;
  date_created: string;
  date_modified: string;
  total: string;
  currency: string;
  status: string;
  payment_method: string;
  customer_id: number | null;
  line_items: {
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    total: string;
    sku: string | null;
  }[];
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  parent_id: number;
};

export async function getMyOrders(customerEmail: string): Promise<WCOrder[]> {
  // Try to get customer ID first
  const customer = await getCustomerByEmail(customerEmail);

  let orders: WCOrder[] = [];

  if (customer) {
    // Try fetching by customer ID
    orders = await fetchOrdersByCustomerId(customer.id);
    if (orders.length > 0) {
      return orders;
    }
  }

  // Fallback: fetch recent orders and filter by billing email
  // (handles guest checkouts where no customer account exists)
  const allOrders = await fetchRecentOrders();
  return allOrders.filter((order) =>
    order.billing?.email?.toLowerCase() === customerEmail.toLowerCase()
  );
}

async function fetchOrdersByCustomerId(customerId: number): Promise<WCOrder[]> {
  const url = buildUrl(`/wc/v3/orders?customer=${customerId}&per_page=50`);
  const data = await fetchWC<WCOrder[]>(url);
  return data ?? [];
}

async function fetchRecentOrders(): Promise<WCOrder[]> {
  const url = buildUrl("/wc/v3/orders?per_page=50&orderby=date&order=desc");
  const data = await fetchWC<WCOrder[]>(url);
  return data ?? [];
}

export async function getOrderById(orderId: string, customerEmail: string): Promise<WCOrder | null> {
  // First try direct fetch by ID, then verify ownership via billing email
  const url = buildUrl(`/wc/v3/orders/${orderId}`);
  const order = await fetchWC<WCOrder | null>(url);

  if (!order) return null;

  // Verify the order belongs to this customer
  if (order.billing?.email?.toLowerCase() === customerEmail.toLowerCase()) {
    return order;
  }

  // If customer exists, also check customer_id
  const customer = await getCustomerByEmail(customerEmail);
  if (customer && order.customer_id === customer.id) {
    return order;
  }

  console.warn(`[wpaxiom-orders] Order ${orderId} does not belong to ${customerEmail}`);
  return null;
}

function buildUrl(path: string): string {
  const WORDPRESS_API_URL =
    process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";
  return `${WORDPRESS_API_URL}${path}`;
}

async function fetchWC<T>(url: string): Promise<T | null> {
  const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
  const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    console.warn("[wpaxiom-orders] WC credentials not configured");
    return null;
  }

  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64");

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`[wpaxiom-orders] ${res.status} ${url}: ${body.slice(0, 200)}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[wpaxiom-orders] fetch failed for ${url}:`, error);
    return null;
  }
}