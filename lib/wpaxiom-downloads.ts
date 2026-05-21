// Client for /wpaxiom/v1/downloads on api.wpaxiom.com.
// Auth: Bearer JWT from session.

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export type WPAxiomDownload = {
  product_id: number;
  product_name: string;
  download_name: string;
  download_url: string;
  version: string | null;
  released_at: string | null;
  order_id: number | null;
  downloads_remaining: string | number | null;
  access_expires: string | null;
};

export async function getMyDownloads(token: string): Promise<WPAxiomDownload[]> {
  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/downloads`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(
        `[wpaxiom-downloads] ${res.status} ${url}\n  ${body.slice(0, 200)}`
      );
      return [];
    }
    return (await res.json()) as WPAxiomDownload[];
  } catch (error) {
    console.warn(`[wpaxiom-downloads] fetch failed for ${url}:`, error);
    return [];
  }
}
