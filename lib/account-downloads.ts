import { auth } from "./auth";
import { getMyDownloads, type WPAxiomDownload } from "./wpaxiom-downloads";

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
  const downloads = await getMyDownloads(token);
  return downloads.map(mapDownload);
}
