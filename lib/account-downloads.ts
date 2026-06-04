import { auth } from "./auth";
import { getMyDownloads, type WPAxiomDownload } from "./wpaxiom-downloads";
import { getMyLicenses } from "./wpaxiom-licenses";
import { productNameToR2Key, r2KeyToPluginSlug } from "./r2";

export type AccountDownload = {
  id: string;
  pluginName: string;
  version: string | null;
  releasedAt: string | null;
  downloadUrl: string;
  available: boolean;
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isAvailable(d: WPAxiomDownload): boolean {
  if (!d.download_url) return false;
  const remaining = d.downloads_remaining;
  if (remaining === null || remaining === "" || remaining === undefined) return true;
  const n = Number(remaining);
  if (Number.isNaN(n)) return true;
  return n > 0;
}

function mapDownload(d: WPAxiomDownload, idx: number): AccountDownload {
  return {
    id: `dl-${d.product_id || "x"}-${idx}`,
    pluginName: d.product_name || d.download_name || "Plugin",
    version: d.version,
    releasedAt: formatDate(d.released_at),
    downloadUrl: d.download_url,
    available: isAvailable(d),
  };
}

export async function getDownloadsForCurrentUser(): Promise<AccountDownload[]> {
  const session = await auth();
  const token = session?.user?.wpToken;
  if (!token) return [];

  const [wcDownloads, licenses] = await Promise.all([
    getMyDownloads(token),
    getMyLicenses(token),
  ]);

  const items: AccountDownload[] = wcDownloads.map(mapDownload);

  // Track names already covered by WC downloads to avoid duplicates.
  const seenNames = new Set(items.map((i) => i.pluginName.toLowerCase().trim()));

  for (const lic of licenses) {
    if (lic.status !== "active" && lic.status !== "grace") continue;

    const productName = lic.product_name ?? "";
    const r2Key = productNameToR2Key(productName);
    if (!r2Key) continue;
    if (seenNames.has(productName.toLowerCase().trim())) continue;

    // Point at a stable internal route, not a pre-generated presigned URL.
    // The route re-checks the license and mints a fresh 60s presigned URL at
    // click time — so the link can't go stale even if this page is cached or
    // left open. See app/api/account/download/route.ts.
    const slug = r2KeyToPluginSlug(r2Key);

    items.push({
      id: `r2-${lic.id}`,
      pluginName: productName || "Axiom Blocks Pro",
      version: process.env.AXIOM_BLOCKS_PRO_VERSION ?? null,
      releasedAt: null,
      downloadUrl: `/api/account/download?plugin=${encodeURIComponent(slug)}`,
      available: true,
    });

    seenNames.add(productName.toLowerCase().trim());
  }

  return items;
}
