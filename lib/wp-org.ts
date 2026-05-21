const WP_ORG_API = "https://api.wordpress.org/plugins/info/1.2/";

export type WpOrgStats = {
  version: string;
  rating?: string;
  reviewCount?: string;
  installs?: string;
};

type WpOrgResponse = {
  version: string;
  rating: number;
  num_ratings: number;
  active_installs: number;
};

export async function getWpOrgStats(slug: string): Promise<WpOrgStats | null> {
  const url = `${WP_ORG_API}?action=plugin_information&request[slug]=${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[wp-org] ${res.status} fetching stats for "${slug}"`);
      return null;
    }
    const data: WpOrgResponse | { error: string } = await res.json();
    if ("error" in data) {
      console.warn(`[wp-org] plugin "${slug}" not found on WP.org`);
      return null;
    }
    const hasRatings = data.num_ratings > 0;
    const hasInstalls = data.active_installs > 0;
    return {
      version: data.version,
      rating: hasRatings ? (data.rating / 20).toFixed(1) : undefined,
      reviewCount: hasRatings ? data.num_ratings.toLocaleString("en-US") : undefined,
      installs: hasInstalls
        ? `${data.active_installs.toLocaleString("en-US")}+ active installs`
        : undefined,
    };
  } catch (err) {
    console.warn(`[wp-org] fetch failed for "${slug}":`, err);
    return null;
  }
}
