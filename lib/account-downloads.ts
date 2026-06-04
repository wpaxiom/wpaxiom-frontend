import { auth } from "./auth";
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

// Downloads are served exclusively from the R2 bucket — NOT from WooCommerce's
// downloadable-files panel. The source of truth for "what can this user
// download" is their active/grace licenses: each license whose product maps to
// an R2 object gets a row. The button points at /api/account/download, which
// re-checks the license and mints a fresh presigned URL per click.
export async function getDownloadsForCurrentUser(): Promise<AccountDownload[]> {
  const session = await auth();
  const token = session?.user?.wpToken;
  if (!token) return [];

  const licenses = await getMyLicenses(token);

  const items: AccountDownload[] = [];
  const seenKeys = new Set<string>();

  for (const lic of licenses) {
    if (lic.status !== "active" && lic.status !== "grace") continue;

    const productName = lic.product_name ?? "";
    const r2Key = productNameToR2Key(productName);
    if (!r2Key) continue;
    // One row per distinct R2 file, even if the user holds several licenses
    // that resolve to the same plugin zip.
    if (seenKeys.has(r2Key)) continue;
    seenKeys.add(r2Key);

    const slug = r2KeyToPluginSlug(r2Key);
    items.push({
      id: `r2-${slug}`,
      pluginName: productName || "Axiom Blocks Pro",
      version: process.env.AXIOM_BLOCKS_PRO_VERSION ?? null,
      releasedAt: null,
      downloadUrl: `/api/account/download?plugin=${encodeURIComponent(slug)}`,
      available: true,
    });
  }

  return items;
}
