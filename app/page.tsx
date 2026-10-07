import { Hero } from "@/components/home/Hero";
import { PluginGrid } from "@/components/home/PluginGrid";
import { WhyWpaxiom } from "@/components/home/WhyWpaxiom";
import { AxiomBlocksHighlight } from "@/components/home/AxiomBlocksHighlight";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogPreview } from "@/components/home/BlogPreview";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "wpaxiom — WordPress plugins, refined.",
  description:
    "Three plugins. Zero bloat. wpaxiom builds tightly-scoped WordPress tools for developers who care about query count, bundle size, and maintainability.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <PluginGrid />
      <WhyWpaxiom />
      <AxiomBlocksHighlight />
      <Testimonials />
      <BlogPreview />
    </>
  );
}
