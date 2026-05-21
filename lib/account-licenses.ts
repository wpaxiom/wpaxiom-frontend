import { auth } from "./auth";
import {
  getMyLicenses,
  getLicenseSites,
  type WPAxiomLicense,
} from "./wpaxiom-licenses";

export type License = {
  id: string;
  pluginName: string;
  pluginSlug: string;
  planLabel: string;
  status: "active" | "expired" | "cancelled" | "delivered" | "inactive";
  licenseKey: string;
  maskedKey: string;
  renewsAt: string | null;
  orderId: string | null;
  maxSites: number;
  timesActivated: number;
  autoUpdate: boolean;
  sites: {
    id: number;
    domain: string;
    activatedAt: string;
    status: "active" | "inactive";
  }[];
};

function maskKey(key: string): string {
  if (!key) return "";
  const segments = key.split("-");
  if (segments.length < 3) {
    if (key.length <= 4) return key;
    return key.slice(0, 4) + "•".repeat(Math.max(0, key.length - 8)) + key.slice(-4);
  }
  const head = segments[0];
  const tail = segments[segments.length - 1];
  const middle = segments.slice(1, -1).map((s) => "•".repeat(s.length));
  return [head, ...middle, tail].join("-");
}

function planLabelForMaxSites(max: number): string {
  if (!max) return "—";
  if (max === 1) return "Single · 1 site";
  if (max === 5) return "Business · 5 sites";
  if (max === 10) return "Agency · 10 sites";
  return `${max} sites`;
}

function deriveStatus(license: WPAxiomLicense): License["status"] {
  switch (license.status) {
    case "cancelled":
    case "refunded":
      return "cancelled";
    case "expired":
      return "expired";
    case "disabled":
      return "inactive";
    default:
      return "active";
  }
}

function pluginNameToSlug(name: string | null): string {
  if (!name) return "unknown";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function mapLicense(
  token: string,
  license: WPAxiomLicense
): Promise<License> {
  const sites = await getLicenseSites(token, license.license_key);
  return {
    id: `lic-${license.id}`,
    pluginName: license.product_name ?? `Product (order #${license.order_id})`,
    pluginSlug: pluginNameToSlug(license.product_name),
    planLabel: planLabelForMaxSites(license.max_activations),
    status: deriveStatus(license),
    licenseKey: license.license_key,
    maskedKey: maskKey(license.license_key),
    renewsAt: license.expires_at,
    orderId: license.order_id ? String(license.order_id) : null,
    maxSites: license.max_activations,
    timesActivated: license.current_activations,
    autoUpdate: true,
    sites: sites.map((s) => ({
      id: s.id,
      domain: s.site_url,
      activatedAt: s.activated_at,
      status: "active",
    })),
  };
}

export async function getLicensesForCurrentUser(): Promise<License[]> {
  const session = await auth();
  const token = session?.user?.wpToken;
  if (!token) return [];

  const licenses = await getMyLicenses(token);
  return Promise.all(licenses.map((l) => mapLicense(token, l)));
}
