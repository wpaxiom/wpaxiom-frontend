import type { MetadataRoute } from "next";
import { CHANGELOG } from "@/lib/changelog-data";
import { getPostSitemapEntries } from "@/lib/blog";
import { getAllDocSlugs, getDoc } from "@/lib/docs";

const SITE_URL = "https://wpaxiom.com";

const STATIC_ROUTES = [
  "",
  "/about",
  "/blog",
  "/changelog",
  "/contact",
  "/docs",
  "/donate",
  "/plugins",
  "/plugins/axiom-blocks",
  "/plugins/cartick",
  "/plugins/specifico",
  "/privacy-policy",
  "/refund-policy",
  "/terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/plugins/") ? 0.9 : 0.7,
  }));

  const docEntries: MetadataRoute.Sitemap = await Promise.all(
    getAllDocSlugs().map(async ({ plugin, slug }) => {
      const { frontmatter } = await getDoc(plugin, slug);
      return {
        url: `${SITE_URL}/docs/${plugin}/${slug}`,
        lastModified: new Date(frontmatter.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    }),
  );

  const changelogEntries: MetadataRoute.Sitemap = Array.from(
    new Set(CHANGELOG.map((entry) => entry.plugin)),
  ).map((plugin) => {
    const latest = CHANGELOG.find((entry) => entry.plugin === plugin);
    return {
      url: `${SITE_URL}/changelog/${plugin}`,
      lastModified: latest ? new Date(latest.date) : generatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPostSitemapEntries();
    blogEntries = posts.map(({ slug, modified }) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: new Date(modified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // The sitemap remains useful when the upstream WordPress API is temporarily unavailable.
  }

  return [...staticEntries, ...docEntries, ...changelogEntries, ...blogEntries];
}
