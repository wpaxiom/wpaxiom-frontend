import { CHANGELOG } from "@/lib/changelog-data";

const SITE_URL = "https://wpaxiom.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = CHANGELOG.map((entry) => {
    const url = `${SITE_URL}/changelog/${entry.plugin}`;
    const description = entry.changes
      .map((change) => `${change.type}: ${change.text}`)
      .join("\n");

    return `
      <item>
        <title>${escapeXml(`${entry.plugin} ${entry.version}: ${entry.summary}`)}</title>
        <link>${url}</link>
        <guid isPermaLink="false">${escapeXml(`${entry.plugin}-${entry.version}`)}</guid>
        <pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate>
        <description>${escapeXml(description)}</description>
      </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>wpaxiom plugin changelog</title>
        <link>${SITE_URL}/changelog</link>
        <description>Release notes for Axiom Blocks, Cartick, and Specifico.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

