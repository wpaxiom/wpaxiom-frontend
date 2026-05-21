import { Hero } from "@/components/home/Hero";
import { PluginGrid } from "@/components/home/PluginGrid";
import { WhyWpaxiom } from "@/components/home/WhyWpaxiom";
import { AxiomBlocksHighlight } from "@/components/home/AxiomBlocksHighlight";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogPreview } from "@/components/home/BlogPreview";

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
