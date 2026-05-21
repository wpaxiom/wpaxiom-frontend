import { auth } from "./auth";
import { getMyOrders, getOrderById as fetchOrderById, type WCOrder } from "./wpaxiom-orders";

export type Order = {
  id: string;
  orderNumber: string;
  date: string;
  total: string;
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded" | "failed";
  gateway: "stripe" | "paddle" | "fastspring";
  itemCount: number;
  items: string[];
};

export type OrderItem = {
  name: string;
  sku: string | null;
  quantity: number;
  total: string;
};

export type Address = {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

export type OrderDetail = {
  id: string;
  orderNumber: string;
  date: string;
  total: string;
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded" | "failed";
  gateway: "stripe" | "paddle" | "fastspring";
  itemCount: number;
  items: OrderItem[];
  billing: Address;
  shipping: Address;
};

function formatAmount(value: string, currency: string): string {
  const num = parseFloat(value);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
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

function deriveStatus(status: string): Order["status"] {
  switch (status) {
    case "pending":
    case "processing":
    case "completed":
    case "cancelled":
    case "refunded":
    case "failed":
      return status;
    default:
      return "processing";
  }
}

function deriveGateway(paymentMethod: string | null): Order["gateway"] {
  if (!paymentMethod) return "paddle";
  const method = paymentMethod.toLowerCase();
  if (method.includes("stripe")) return "stripe";
  if (method.includes("paddle")) return "paddle";
  if (method.includes("fastspring")) return "fastspring";
  return "paddle";
}

function mapOrder(order: WCOrder): Order {
  const items = order.line_items.map((item) => item.name);

  return {
    id: String(order.id),
    orderNumber: `Order #${order.number || order.id}`,
    date: formatDate(order.date_created),
    total: formatAmount(order.total, order.currency),
    status: deriveStatus(order.status),
    gateway: deriveGateway(order.payment_method),
    itemCount: order.line_items.reduce((sum: number, item) => sum + item.quantity, 0),
    items,
  };
}

export async function getOrdersForCurrentUser(): Promise<Order[]> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return [];
  const orders = await getMyOrders(email);
  return orders.map(mapOrder);
}

export async function getOrderById(orderId: string): Promise<OrderDetail | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const wcOrder = await fetchOrderById(orderId, email);
  if (!wcOrder) return null;

  return mapOrderDetail(wcOrder);
}

function mapOrderDetail(order: WCOrder): OrderDetail {
  return {
    id: String(order.id),
    orderNumber: `Order #${order.number || order.id}`,
    date: formatDate(order.date_created),
    total: formatAmount(order.total, order.currency),
    status: deriveStatus(order.status),
    gateway: deriveGateway(order.payment_method),
    itemCount: order.line_items.reduce((sum: number, item) => sum + item.quantity, 0),
    items: order.line_items.map((item) => ({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      total: formatAmount(item.total, order.currency),
    })),
    billing: {
      first_name: order.billing.first_name,
      last_name: order.billing.last_name,
      company: order.billing.company || "",
      address_1: order.billing.address_1 || "",
      address_2: order.billing.address_2 || "",
      city: order.billing.city || "",
      state: order.billing.state || "",
      postcode: order.billing.postcode || "",
      country: order.billing.country || "",
      email: order.billing.email,
      phone: order.billing.phone || "",
    },
    shipping: {
      first_name: order.shipping.first_name,
      last_name: order.shipping.last_name,
      company: order.shipping.company || "",
      address_1: order.shipping.address_1 || "",
      address_2: order.shipping.address_2 || "",
      city: order.shipping.city || "",
      state: order.shipping.state || "",
      postcode: order.shipping.postcode || "",
      country: order.shipping.country || "",
    },
  };
}