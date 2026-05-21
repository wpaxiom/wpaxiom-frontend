import { auth } from "./auth";
import {
  getMyInvoices,
  type WPAxiomInvoice,
} from "./wpaxiom-invoices";

export type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "refunded" | "failed";
  gateway: "stripe" | "paddle" | "fastspring";
  description: string;
  downloadUrl: string | null;
};

function formatAmount(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(value: string): string {
  const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function deriveStatus(status: string): Invoice["status"] {
  switch (status) {
    case "paid":
      return "paid";
    case "refunded":
      return "refunded";
    case "failed":
    case "pending":
    case "cancelled":
      return "failed";
    default:
      return "paid";
  }
}

function deriveGateway(paymentMethod: string | null): Invoice["gateway"] {
  if (!paymentMethod) return "paddle";
  const method = paymentMethod.toLowerCase();
  if (method.includes("stripe")) return "stripe";
  if (method.includes("paddle")) return "paddle";
  if (method.includes("fastspring")) return "fastspring";
  return "paddle";
}

function mapInvoice(inv: WPAxiomInvoice): Invoice {
  const firstItem = inv.line_items[0];
  const description = firstItem
    ? `${firstItem.product_name || firstItem.name}`
    : `Order #${inv.order_id}`;

  return {
    id: String(inv.order_id),
    date: formatDate(inv.date_created),
    amount: formatAmount(inv.total, inv.currency),
    status: deriveStatus(inv.status),
    gateway: deriveGateway(inv.payment_method),
    description,
    downloadUrl: inv.pdf_url,
  };
}

export async function getInvoicesForCurrentUser(): Promise<Invoice[]> {
  const session = await auth();
  const token = session?.user?.wpToken;
  if (!token) return [];
  const invoices = await getMyInvoices(token);
  return invoices.map(mapInvoice);
}