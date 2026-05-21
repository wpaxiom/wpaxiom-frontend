// Client for /wpaxiom/v1/invoices on api.wpaxiom.com.
// Auth: Bearer JWT from session.

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export type WPAxiomInvoice = {
  id: number;
  order_id: number;
  invoice_number: string;
  date_created: string;
  date_modified: string;
  total: number;
  currency: string;
  status: "paid" | "refunded" | "failed" | "pending";
  payment_method: string;
  pdf_url: string | null;
  line_items: {
    name: string;
    product_name: string;
    quantity: number;
    total: number;
  }[];
};

const BASE_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (compatible; wpaxiom-frontend/1.0; +https://wpaxiom.com)",
};

export async function getMyInvoices(token: string): Promise<WPAxiomInvoice[]> {
  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/invoices`;
  try {
    const res = await fetch(url, {
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(
        `[wpaxiom-invoices] ${res.status} ${url}\n  ${body.slice(0, 200)}`
      );
      return [];
    }
    return (await res.json()) as WPAxiomInvoice[];
  } catch (error) {
    console.warn(`[wpaxiom-invoices] fetch failed for ${url}:`, error);
    return [];
  }
}