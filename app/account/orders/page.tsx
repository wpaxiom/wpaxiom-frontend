import type { Metadata } from "next";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { getOrdersForCurrentUser } from "@/lib/account-orders";
import { OrderStatusPill } from "@/components/account/OrderStatusPill";

export const metadata: Metadata = {
  title: "Orders — wpaxiom account",
};

export default async function OrdersPage() {
  const orders = await getOrdersForCurrentUser();

  return (
    <>
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted mb-2">// Account</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Orders</h1>
        <p className="mt-2 text-sm text-muted">
          Your purchase history. View details and download invoices anytime.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <div className="text-base font-medium text-ink">No orders yet.</div>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            When you purchase a Pro license, your orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-elevated border border-line flex items-center justify-center flex-none">
                    <Package size={20} strokeWidth={1.7} className="text-coral" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-ink tracking-tight flex items-baseline gap-2 min-w-0">
                      <span className="flex-none">{order.orderNumber}</span>
                      {order.items.length > 0 && (
                        <>
                          <span className="text-line flex-none">·</span>
                          <span className="text-sm font-normal text-subtle truncate">{order.items.join(", ")}</span>
                        </>
                      )}
                    </h2>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <OrderStatusPill status={order.status} />
                      <span className="text-xs text-muted font-mono">
                        {order.date} · {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:text-right">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-subtle">Total</div>
                  <div className="text-xl font-semibold text-ink mt-0.5 tabular-nums">{order.total}</div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-line">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition"
                >
                  View order details
                  <ArrowRight size={13} strokeWidth={2} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
