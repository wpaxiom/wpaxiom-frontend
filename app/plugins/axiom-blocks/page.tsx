import { Breadcrumb } from "@/components/plugin/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/plugin/axiom-blocks/Hero";
import { FeatureGrid } from "@/components/plugin/axiom-blocks/FeatureGrid";
import { AXIOM_BLOCKS_FAQS, FAQ } from "@/components/plugin/axiom-blocks/FAQ";
import { SupportCTA } from "@/components/plugin/axiom-blocks/SupportCTA";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo";

const title = "Axiom Blocks — wpaxiom";
const description =
  "Production-ready blocks for the WordPress block editor. Theme-aware, accessible, and zero unnecessary JavaScript.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/plugins/axiom-blocks",
});

const structuredData = [
  softwareApplicationJsonLd({
    name: "Axiom Blocks",
    description,
    path: "/plugins/axiom-blocks",
    downloadUrl: "https://wordpress.org/plugins/axiom-blocks/",
  }),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Plugins", path: "/plugins" },
    { name: "Axiom Blocks", path: "/plugins/axiom-blocks" },
  ]),
  faqJsonLd(AXIOM_BLOCKS_FAQS),
];

export default function AxiomBlocksPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <Breadcrumb
        trail={[
          { label: "Home", href: "/" },
          { label: "Plugins", href: "/plugins" },
          { label: "Axiom Blocks" },
        ]}
      />
      <Hero />
      <FeatureGrid />
      <FAQ />
      <SupportCTA />
    </>
  );
}
