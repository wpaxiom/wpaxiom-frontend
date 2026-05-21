import type { GatewaySlug, PaymentProvider } from "./types";
import { paddleProvider } from "./providers/paddle";

// Add future providers here:
// import { stripeProvider } from "./providers/stripe";
// import { paypalProvider } from "./providers/paypal";

const providers: Partial<Record<GatewaySlug, PaymentProvider>> = {
  paddle: paddleProvider,
};

export function getProvider(slug: GatewaySlug): PaymentProvider | null {
  return providers[slug] ?? null;
}
