// Client for the License Manager for WooCommerce REST API.
// Auth: Basic auth with consumer key + secret generated in
// WP Admin → WooCommerce → Settings → License Manager → REST API.
//
// Docs: https://www.licensemanager.at/docs/rest-api/

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";
const LMFWC_CONSUMER_KEY = process.env.LMFWC_CONSUMER_KEY;
const LMFWC_CONSUMER_SECRET = process.env.LMFWC_CONSUMER_SECRET;

// LMFWC license status codes (from the plugin source):
//   1 = SOLD       — created in an order, not yet delivered
//   2 = DELIVERED  — emailed to the customer, ready to use
//   3 = ACTIVE     — at least one site activated
//   4 = INACTIVE   — explicitly deactivated
//   5 = DISABLED   — admin-disabled
export const LM_STATUS = {
  SOLD: 1,
  DELIVERED: 2,
  ACTIVE: 3,
  INACTIVE: 4,
  DISABLED: 5,
} as const;

export type LMLicense = {
  id: number;
  orderId: number | null;
  productId: number | null;
  userId: number | null;
  licenseKey: string;
  hash: string;
  expiresAt: string | null;
  validFor: number | null;
  source: number;
  status: number;
  timesActivated: number | null;
  timesActivatedMax: number | null;
  createdAt: string;
  createdBy: number | null;
  updatedAt: string | null;
  updatedBy: number | null;
};

function buildAuthHeader(): string | null {
  if (!LMFWC_CONSUMER_KEY || !LMFWC_CONSUMER_SECRET) return null;
  const token = Buffer.from(`${LMFWC_CONSUMER_KEY}:${LMFWC_CONSUMER_SECRET}`).toString(
    "base64"
  );
  return `Basic ${token}`;
}

const FETCH_HEADERS_BASE: Record<string, string> = {
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (compatible; wpaxiom-frontend/1.0; +https://wpaxiom.com)",
};

type LMErrorBody = {
  code?: string;
  message?: string;
  data?: { status?: number };
};

// LMFWC returns 404 + { code: "lmfwc_rest_data_error" } when a list endpoint
// has zero results. That's not actually an error condition — treat it as empty.
function isEmptyDataResponse(status: number, body: string): boolean {
  if (status !== 404) return false;
  try {
    const parsed = JSON.parse(body) as LMErrorBody;
    return parsed.code === "lmfwc_rest_data_error";
  } catch {
    return false;
  }
}

type FetchOutcome<T> =
  | { ok: true; data: T | null }
  | { ok: false; empty: boolean };

async function lmFetch<T>(path: string): Promise<FetchOutcome<T>> {
  const url = `${WORDPRESS_API_URL}/lmfwc/v2${path}`;
  const auth = buildAuthHeader();
  if (!auth) {
    console.warn(
      "[lmfwc-api] LMFWC_CONSUMER_KEY / LMFWC_CONSUMER_SECRET not configured"
    );
    return { ok: false, empty: false };
  }
  try {
    const res = await fetch(url, {
      headers: { ...FETCH_HEADERS_BASE, Authorization: auth },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (isEmptyDataResponse(res.status, body)) {
        return { ok: false, empty: true };
      }
      console.warn(
        `[lmfwc-api] ${res.status} ${url}\n  first 200 chars: ${body.slice(0, 200)}`
      );
      return { ok: false, empty: false };
    }
    const json = (await res.json()) as { success?: boolean; data?: T } | T;
    if (json && typeof json === "object" && "success" in json) {
      const wrapper = json as { success: boolean; data: T };
      if (!wrapper.success) return { ok: false, empty: false };
      return { ok: true, data: wrapper.data ?? null };
    }
    return { ok: true, data: (json as T) ?? null };
  } catch (error) {
    console.warn(`[lmfwc-api] fetch failed for ${url}:`, error);
    return { ok: false, empty: false };
  }
}

export async function listLicenses(): Promise<LMLicense[]> {
  const result = await lmFetch<LMLicense[]>("/licenses");
  if (!result.ok) return []; // empty + error both render as empty list
  return result.data ?? [];
}

export async function getLicense(licenseKey: string): Promise<LMLicense | null> {
  const result = await lmFetch<LMLicense>(
    `/licenses/${encodeURIComponent(licenseKey)}`
  );
  return result.ok ? result.data : null;
}

