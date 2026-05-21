// Server-to-server admin endpoint on the wpaxiom-licensing WP plugin.
// Auth: shared secret in WPAXIOM_ADMIN_SECRET, sent as X-Wpaxiom-Admin-Secret.
//
// WP-side endpoint (in wpaxiom-licensing plugin):
//   POST /wpaxiom/v1/admin/licenses/issue
//   Header: X-Wpaxiom-Admin-Secret
//   Body:   { "subscription_id": <int> }  (preferred — license creation is subscription-scoped)
//   Returns: array of IssuedLicense — one per line item in the subscription

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";
const WPAXIOM_ADMIN_SECRET = process.env.WPAXIOM_ADMIN_SECRET;

export type IssuedLicense = {
  id: number;
  license_key: string;
  order_id: number;
  subscription_id: number | null;
  product_id: number | null;
  variation_id: number | null;
  customer_id: number | null;
  max_activations: number;
  current_activations: number;
  status: string;
  expires_at: string | null;
  created_at: string;
};

export type IssueLicensesResult =
  | { ok: true; licenses: IssuedLicense[] }
  | { ok: false; status: number; body: string };

export type PasswordResetLink = {
  user_id: number;
  email: string;
  user_login: string;
  reset_url: string;
  expires_in_hours: number;
};

// Asks the wpaxiom-licensing plugin to generate a one-time password reset key
// for the given user. Used for two flows:
//  1. New customer auto-created from a Paddle purchase — they need to set
//     a password to access their account at wpaxiom.com
//  2. Existing customer hits "Forgot password" on the login form
//
// The returned reset_url points at WP's built-in /wp-login.php?action=rp page.
// Eventually this should land on a Next.js page, but the WP page works for MVP.
export async function generatePasswordResetLink(
  email: string
): Promise<PasswordResetLink | null> {
  if (!WPAXIOM_ADMIN_SECRET) {
    console.warn("[wpaxiom-admin] WPAXIOM_ADMIN_SECRET not configured");
    return null;
  }

  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/admin/password-reset`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Wpaxiom-Admin-Secret": WPAXIOM_ADMIN_SECRET,
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        `[wpaxiom-admin] generatePasswordResetLink ${res.status}: ${text.slice(0, 500)}`
      );
      return null;
    }
    return (await res.json()) as PasswordResetLink;
  } catch (error) {
    console.warn("[wpaxiom-admin] generatePasswordResetLink failed:", error);
    return null;
  }
}

export type CompletePasswordResetResult =
  | { ok: true; email: string; user_login: string }
  | { ok: false; status: number; code: string; message: string };

// Validates a reset key (issued by generatePasswordResetLink) and sets the new
// password. Called from /api/auth/reset-password — keeps the admin secret on
// the server, never reaches the browser.
export async function completePasswordReset(args: {
  key: string;
  login: string;
  password: string;
}): Promise<CompletePasswordResetResult> {
  if (!WPAXIOM_ADMIN_SECRET) {
    return {
      ok: false,
      status: 0,
      code: "missing_secret",
      message: "WPAXIOM_ADMIN_SECRET not configured",
    };
  }

  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/admin/password-reset-complete`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Wpaxiom-Admin-Secret": WPAXIOM_ADMIN_SECRET,
      },
      body: JSON.stringify({
        key: args.key,
        login: args.login,
        password: args.password,
      }),
      cache: "no-store",
    });
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      email?: string;
      user_login?: string;
      code?: string;
      message?: string;
    };
    if (!res.ok || body.ok !== true) {
      return {
        ok: false,
        status: res.status,
        code: String(body.code ?? `http_${res.status}`),
        message: String(body.message ?? "Password reset failed"),
      };
    }
    return {
      ok: true,
      email: String(body.email ?? ""),
      user_login: String(body.user_login ?? args.login),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      code: "network_error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export type RecentlyExpiredLicense = {
  id: number;
  license_key: string;
  product_id: number;
  expires_at: string; // MySQL UTC datetime
  status: string;
  customer_id: number;
  customer_email: string;
  customer_name: string;
};

// Calls the wpaxiom-licensing admin endpoint to list licenses whose expires_at
// fell within the last `hours` (default 24, max 168). Used by the daily
// /api/cron/license-expired route.
export async function listRecentlyExpiredLicenses(
  hours = 24
): Promise<RecentlyExpiredLicense[]> {
  if (!WPAXIOM_ADMIN_SECRET) {
    console.warn("[wpaxiom-admin] WPAXIOM_ADMIN_SECRET not configured");
    return [];
  }
  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/admin/licenses/expired-recently?hours=${hours}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Wpaxiom-Admin-Secret": WPAXIOM_ADMIN_SECRET,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        `[wpaxiom-admin] listRecentlyExpiredLicenses ${res.status}: ${text.slice(0, 300)}`
      );
      return [];
    }
    return (await res.json()) as RecentlyExpiredLicense[];
  } catch (e) {
    console.warn("[wpaxiom-admin] listRecentlyExpiredLicenses failed:", e);
    return [];
  }
}

export async function issueLicensesForSubscription(
  subscriptionId: number
): Promise<IssueLicensesResult> {
  if (!WPAXIOM_ADMIN_SECRET) {
    return { ok: false, status: 0, body: "WPAXIOM_ADMIN_SECRET not configured in .env.local" };
  }

  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/admin/licenses/issue`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Wpaxiom-Admin-Secret": WPAXIOM_ADMIN_SECRET,
      },
      body: JSON.stringify({ subscription_id: subscriptionId }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        `[wpaxiom-admin] issueLicensesForSubscription ${res.status} ${url}\n  first 500 chars: ${text.slice(0, 500)}`
      );
      return { ok: false, status: res.status, body: text.slice(0, 500) };
    }
    return { ok: true, licenses: (await res.json()) as IssuedLicense[] };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { ok: false, status: 0, body: `fetch error: ${msg}` };
  }
}
