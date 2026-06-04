// TEMPORARY: wired to test the create-order flow via a real Paddle checkout.
// To revert, restore the original one-liner:
//   import { redirect } from "next/navigation";
//   export default function PricingPage() { redirect("/plugins/axiom-blocks"); }

import { redirect } from "next/navigation";
import { getProductBySlug, getProductVariations } from "@/lib/wp-api";
import { buildMatrix } from "@/lib/pricing";
import { PricingCheckoutTest } from "@/components/plugin/axiom-blocks/pricing/PricingCheckoutTest";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const product = await getProductBySlug("axiom-blocks");
  if (!product) redirect("/plugins/axiom-blocks");

  const variations = await getProductVariations(product.id);
  const matrix = buildMatrix(variations);
  if (!matrix) redirect("/plugins/axiom-blocks");

  return <PricingCheckoutTest matrix={matrix} />;
}
