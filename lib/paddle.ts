"use client";

// Paddle Billing JS SDK wrapper. Uses paddle.js v2 (Billing), not the legacy
// Classic loader. Initialised lazily on first checkout open.

type PaddleEvent = {
  name?: string;
  data?: unknown;
};

type PaddleCheckoutItem = { priceId: string; quantity: number };

type PaddleCheckoutOptions = {
  items: PaddleCheckoutItem[];
  customer?: { email?: string };
  customData?: Record<string, unknown>;
  settings?: {
    successUrl?: string;
    displayMode?: "overlay" | "inline";
    theme?: "light" | "dark";
  };
};

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: "sandbox" | "production") => void };
      Initialize: (config: {
        token: string;
        eventCallback?: (event: PaddleEvent) => void;
      }) => void;
      Checkout: { open: (config: PaddleCheckoutOptions) => void };
    };
  }
}

const TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
const IS_SANDBOX = process.env.NEXT_PUBLIC_PADDLE_ENV !== "production";
const SCRIPT_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";

let readyPromise: Promise<void> | null = null;

function configure(eventCallback?: (event: PaddleEvent) => void): void {
  if (typeof window === "undefined" || !window.Paddle) return;
  window.Paddle.Environment.set(IS_SANDBOX ? "sandbox" : "production");
  if (TOKEN) {
    window.Paddle.Initialize({ token: TOKEN, eventCallback });
  }
}

export function loadPaddle(eventCallback?: (event: PaddleEvent) => void): Promise<void> {
  if (readyPromise) return readyPromise;
  readyPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Paddle is browser-only"));
      return;
    }
    if (!TOKEN) {
      reject(new Error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set"));
      return;
    }
    if (window.Paddle) {
      configure(eventCallback);
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      configure(eventCallback);
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Paddle.js v2"));
    document.head.appendChild(script);
  });
  return readyPromise;
}

export type OpenCheckoutOptions = {
  priceId: string;
  email?: string;
  customData?: Record<string, unknown>;
  successUrl?: string;
  onEvent?: (event: PaddleEvent) => void;
};

export async function openPaddleCheckout(options: OpenCheckoutOptions): Promise<void> {
  await loadPaddle(options.onEvent);
  if (!window.Paddle) throw new Error("Paddle failed to initialise");

  window.Paddle.Checkout.open({
    items: [{ priceId: options.priceId, quantity: 1 }],
    customer: options.email ? { email: options.email } : undefined,
    customData: options.customData,
    settings: options.successUrl ? { successUrl: options.successUrl } : undefined,
  });
}
