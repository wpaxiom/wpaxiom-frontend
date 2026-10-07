import { PLUGINS } from "@/lib/plugins";
import { PLUGIN_PAGE_DATA } from "@/lib/plugin-page-data";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";
import { PluginHero } from "@/components/plugin/PluginHero";
import { FeatureGrid } from "@/components/plugin/FeatureGrid";
import { PluginFAQ } from "@/components/plugin/PluginFAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo";

const plugin = PLUGINS.find((p) => p.slug === "cartick")!;
const data = PLUGIN_PAGE_DATA.cartick;

export const metadata = createPageMetadata({
  title: `${plugin.name} — wpaxiom`,
  description: plugin.tagline,
  path: "/plugins/cartick",
});

export default async function CartickPage() {
  const structuredData = [
    softwareApplicationJsonLd({
      name: plugin.name,
      description: plugin.tagline,
      path: "/plugins/cartick",
      downloadUrl: plugin.wpOrgUrl,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Plugins", path: "/plugins" },
      { name: plugin.name, path: "/plugins/cartick" },
    ]),
    faqJsonLd(data.faqs),
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
        badges={data.badges}
        wpVersion={data.wpVersion}
        ctas={[
          {
            label: "Read the docs",
            href: `/docs/${plugin.slug}`,
            variant: "primary",
          },
          {
            label: "Ask about availability",
            href: "/contact",
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
              href="mailto:support@wpaxiom.com"
              className="text-ink underline-offset-4 hover:underline"
            >
              Email support
            </a>{" "}
            for help or availability.
          </>
        }
      />
    </>
  );
}
