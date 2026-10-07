import { PLUGINS } from "@/lib/plugins";
import { PLUGIN_PAGE_DATA } from "@/lib/plugin-page-data";
import { getWpOrgStats } from "@/lib/wp-org";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";
import { PluginHero } from "@/components/plugin/PluginHero";
import { FeatureGrid } from "@/components/plugin/FeatureGrid";
import { PluginFAQ } from "@/components/plugin/PluginFAQ";
import { FreePluginSupportCTA } from "@/components/plugin/FreePluginSupportCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo";

export const revalidate = 3600;

const plugin = PLUGINS.find((p) => p.slug === "specifico")!;
const data = PLUGIN_PAGE_DATA.specifico;

export const metadata = createPageMetadata({
  title: `${plugin.name} — wpaxiom`,
  description: plugin.tagline,
  path: "/plugins/specifico",
});

export default async function SpecificoPage() {
  const stats = await getWpOrgStats(plugin.slug);
  const structuredData = [
    softwareApplicationJsonLd({
      name: plugin.name,
      description: plugin.tagline,
      path: "/plugins/specifico",
      downloadUrl: plugin.wpOrgUrl,
      version: stats?.version,
      rating: stats?.rating,
      reviewCount: stats?.reviewCount,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Plugins", path: "/plugins" },
      { name: plugin.name, path: "/plugins/specifico" },
    ]),
    faqJsonLd(data.faqs),
  ];

  const badges = [
    ...(stats?.version ? [{ label: `v${stats.version}`, tone: "neutral" as const }] : []),
    ...data.badges,
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Breadcrumb
        trail={[
          { label: "Home", href: "/" },
          { label: "Plugins", href: "/plugins" },
          { label: plugin.name },
        ]}
      />
      <PluginHero
        name={plugin.name}
        tagline={plugin.tagline}
        badges={badges}
        rating={stats?.rating}
        reviewCount={stats?.reviewCount ? `${stats.reviewCount} reviews` : undefined}
        installs={stats?.installs}
        wpVersion={data.wpVersion}
        ctas={[
          {
            label: "Download from WordPress.org",
            href: plugin.wpOrgUrl!,
            variant: "primary",
            external: true,
          },
          {
            label: "Read the docs",
            href: `/docs/${plugin.slug}`,
            variant: "ghost",
          },
        ]}
      />
      <FeatureGrid
        eyebrow={data.featureGrid.eyebrow}
        headline={data.featureGrid.headline}
        lead={data.featureGrid.lead}
        features={data.features}
      />
      <PluginFAQ
        items={data.faqs}
        helperText={
          <>
            Don&apos;t see yours?{" "}
            <a
              href={`https://wordpress.org/support/plugin/${plugin.slug}/`}
              className="text-ink underline-offset-4 hover:underline"
            >
              Ask on the forum
            </a>{" "}
            for public, searchable support.
          </>
        }
      />
      <FreePluginSupportCTA
        pluginName={plugin.name}
        forumHref={`https://wordpress.org/support/plugin/${plugin.slug}/`}
      />
    </>
  );
}
