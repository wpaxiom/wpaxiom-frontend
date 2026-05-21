// Placeholder data for the /account UI shell. Will be replaced with live
// fetches from WC v3 + License Manager for WooCommerce REST in the next
// session, once Paddle is wired and webhooks are populating real records.

export type MockUser = {
  name: string;
  email: string;
  avatarInitials: string;
};

export type MockSite = {
  domain: string;
  activatedAt: string;
  status: "active" | "inactive";
};

export type MockLicense = {
  id: string;
  pluginName: string;
  pluginSlug: string;
  planLabel: string;
  status: "active" | "expired" | "cancelled" | "free";
  licenseKey: string;
  maskedKey: string;
  renewsAt: string | null;
  orderId: string | null;
  sites: MockSite[];
  maxSites: number;
  autoUpdate: boolean;
  isFree?: boolean;
};

export type MockSubscription = {
  id: string;
  pluginName: string;
  planLabel: string;
  cycle: "monthly" | "yearly";
  amount: string;
  nextRenewal: string;
  paymentLast4: string;
  status: "active" | "cancelled" | "past_due";
};

export type MockDownload = {
  pluginName: string;
  version: string;
  releasedAt: string;
  available: boolean;
  reason?: string;
};

export type MockInvoice = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "refunded" | "failed";
  gateway: "stripe" | "paddle" | "fastspring";
  description: string;
};

export const MOCK_USER: MockUser = {
  name: "Sarah Klein",
  email: "sarah@klein.dev",
  avatarInitials: "SK",
};

export const MOCK_LICENSES: MockLicense[] = [
  {
    id: "lic_1",
    pluginName: "Axiom Blocks Pro",
    pluginSlug: "axiom-blocks",
    planLabel: "Business · 5 sites",
    status: "active",
    licenseKey: "AXB-7K9P-Q3R8-2N5W-9K2M",
    maskedKey: "AXB-••••-••••-••••-9K2M",
    renewsAt: "2026-01-15",
    orderId: "wpa-2024-1184",
    sites: [
      { domain: "mystore.com", activatedAt: "Activated 3 days ago", status: "active" },
      { domain: "shop.agency.com", activatedAt: "Activated 2 weeks ago", status: "active" },
      { domain: "staging.mystore.com", activatedAt: "Activated 1 month ago", status: "active" },
    ],
    maxSites: 5,
    autoUpdate: true,
  },
  {
    id: "lic_2",
    pluginName: "Axiom Blocks",
    pluginSlug: "axiom-blocks",
    planLabel: "Free",
    status: "free",
    licenseKey: "",
    maskedKey: "",
    renewsAt: null,
    orderId: null,
    sites: [],
    maxSites: 0,
    autoUpdate: false,
    isFree: true,
  },
];

export const MOCK_SUBSCRIPTIONS: MockSubscription[] = [
  {
    id: "sub_1",
    pluginName: "Axiom Blocks Pro",
    planLabel: "Business · 5 sites",
    cycle: "yearly",
    amount: "$119.00",
    nextRenewal: "Jan 15, 2026",
    paymentLast4: "4242",
    status: "active",
  },
];

export const MOCK_DOWNLOADS: MockDownload[] = [
  { pluginName: "Axiom Blocks Pro", version: "3.4.2", releasedAt: "Apr 28, 2026", available: true },
  { pluginName: "Axiom Blocks (Free)", version: "3.4.0", releasedAt: "Apr 14, 2026", available: true },
  { pluginName: "Cartick", version: "2.4.1", releasedAt: "May 1, 2026", available: true },
  { pluginName: "Specifico", version: "1.8.0", releasedAt: "Apr 22, 2026", available: true },
];

export const MOCK_INVOICES: MockInvoice[] = [
  {
    id: "wpa-2024-1184",
    date: "Jan 15, 2025",
    amount: "$119.00",
    status: "paid",
    gateway: "paddle",
    description: "Axiom Blocks Pro · Business · Yearly",
  },
  {
    id: "wpa-2024-0871",
    date: "Jan 15, 2024",
    amount: "$119.00",
    status: "paid",
    gateway: "paddle",
    description: "Axiom Blocks Pro · Business · Yearly",
  },
];
