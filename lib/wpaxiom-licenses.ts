// Client for the wpaxiom/v1 REST namespace on api.wpaxiom.com.
// Auth: Bearer JWT issued by jwt-authentication-for-wp-rest-api during login.
// Pulled from `session.user.wpToken` in server components.

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export type WPAxiomLicense = {
  id: number;
  license_key: string;
  product_name: string | null;
  order_id: number;
  subscription_id: number | null;
  max_activations: number;
  current_activations: number;
  status: string;
  expires_at: string | null;
  created_at: string;
};

export type WPAxiomSite = {
  id: number;
  site_url: string;
  activated_at: string;
  last_seen_at: string;
};

const BASE_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (compatible; wpaxiom-frontend/1.0; +https://wpaxiom.com)",
};

async function wpaxiomFetch<T>(
  path: string,
  options: { token: string; method?: string; body?: unknown }
): Promise<T | null> {
  const url = `${WORDPRESS_API_URL}/wpaxiom/v1${path}`;
  try {
    const res = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${options.token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(
        `[wpaxiom-licenses] ${res.status} ${url}\n  ${body.slice(0, 200)}`
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[wpaxiom-licenses] fetch failed for ${url}:`, error);
    return null;
  }
}

export async function getMyLicenses(token: string): Promise<WPAxiomLicense[]> {
  return (await wpaxiomFetch<WPAxiomLicense[]>("/license", { token })) ?? [];
}

export async function getLicenseSites(
  token: string,
  licenseKey: string
): Promise<WPAxiomSite[]> {
  const path = `/license/${encodeURIComponent(licenseKey)}/sites`;
  return (await wpaxiomFetch<WPAxiomSite[]>(path, { token })) ?? [];
}

export async function deactivateLicenseSite(
  token: string,
  licenseKey: string,
  activationId: number
): Promise<boolean> {
  const path = `/license/${encodeURIComponent(licenseKey)}/sites/${activationId}`;
  const result = await wpaxiomFetch<{ ok: boolean }>(path, {
    token,
    method: "DELETE",
  });
  return Boolean(result?.ok);
}

export type ActivateResult =
  | {
      ok: true;
      status: string;
      expires_at: string | null;
      max_activations: number;
      current_activations: number;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

export async function activateLicenseSite(
  licenseKey: string,
  siteUrl: string
): Promise<ActivateResult> {
  // /activate is unauthenticated — license_key is the credential.
  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/license/activate`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { ...BASE_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ license_key: licenseKey, site_url: siteUrl }),
      cache: "no-store",
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok || body.ok !== true) {
      return {
        ok: false,
        code: String(body.code ?? `http_${res.status}`),
        message: String(body.message ?? "Activation failed"),
      };
    }
    return {
      ok: true,
      status: String(body.status ?? "active"),
      expires_at: (body.expires_at as string | null) ?? null,
      max_activations: Number(body.max_activations ?? 0),
      current_activations: Number(body.current_activations ?? 0),
    };
  } catch (error) {
    return {
      ok: false,
      code: "network_error",
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
