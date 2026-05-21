import type { Metadata } from "next";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";
import { Hero } from "@/components/plugin/axiom-blocks/Hero";
import { FeatureGrid } from "@/components/plugin/axiom-blocks/FeatureGrid";
import { FAQ } from "@/components/plugin/axiom-blocks/FAQ";
import { SupportCTA } from "@/components/plugin/axiom-blocks/SupportCTA";

export const metadata: Metadata = {
  title: "Axiom Blocks — wpaxiom",
  description:
    "Production-ready blocks for the WordPress block editor. Theme-aware, accessible, and zero unnecessary JavaScript.",
};

export default function AxiomBlocksPage() {
  return (
    <>
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
