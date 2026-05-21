import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/account-orders";
import { OrderStatusPill } from "@/components/account/OrderStatusPill";
import { PrintButton } from "@/components/account/PrintButton";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} — wpaxiom account`,
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const billing = order.billing;
  const hasBillingAddress = !!(
    billing.first_name ||
    billing.last_name ||
    billing.address_1 ||
    billing.city
  );

  return (
    <>
      {/* UI chrome — hidden on print */}
      <Link
        href="/account/orders"
        className="print:hidden inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition mb-6"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Back to orders
      </Link>

      <div className="print:hidden flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted mb-2">// Order</div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">{order.orderNumber}</h1>
          <div className="mt-2 flex items-center gap-3">
            <OrderStatusPill status={order.status} />
            <span className="text-sm text-muted">{order.date}</span>
          </div>
        </div>
        <PrintButton />
      </div>

      {/* Invoice document — the only thing that prints */}
      <div id="invoice-doc" className="rounded-2xl border border-line bg-surface overflow-hidden">

        {/* Document header */}
        <div className="px-8 py-8 border-b border-line">
          <div className="flex items-start justify-between gap-6">

            {/* Left: brand + contact */}
            <div className="flex items-start gap-3">
              {/* Logo — visible on print only */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-icon.svg"
                alt=""
                aria-hidden="true"
                width={40}
                height={32}
                className="hidden print:block object-contain flex-none mt-0.5"
                style={{ width: 40, height: "auto" }}
              />
              <div>
                <div className="text-base font-semibold tracking-tight text-ink">wpaxiom</div>
                <div className="text-xs text-muted mt-0.5">wpaxiom.com</div>
                <div className="text-xs text-muted mt-0.5">support@wpaxiom.com</div>
              </div>
            </div>

            {/* Right: INVOICE label + order details — print only */}
            <div className="hidden print:block text-right">
              <div className="text-2xl font-bold tracking-tight text-ink">INVOICE</div>
              <div className="text-sm font-medium text-ink mt-1">{order.orderNumber}</div>
              <div className="text-xs text-muted mt-0.5">{order.date}</div>
              <div className="mt-1.5">
                <OrderStatusPill status={order.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 pb-3 border-b border-line">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Item</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted text-right">Qty</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted text-right">Total</span>
          </div>

          <ul>
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="grid grid-cols-[1fr_auto_auto] gap-x-8 py-4 border-b border-line last:border-0 items-start"
              >
                <div>
                  <div className="text-sm font-medium text-ink">{item.name}</div>
                  {item.sku && (
                    <div className="text-xs text-subtle font-mono mt-0.5">SKU: {item.sku}</div>
                  )}
                </div>
                <div className="text-sm text-muted text-right tabular-nums">{item.quantity}</div>
                <div className="text-sm font-medium text-ink text-right tabular-nums">{item.total}</div>
              </li>
            ))}
          </ul>

          <div className="flex justify-end pt-4">
            <div className="w-52">
              <div className="flex justify-between text-sm font-semibold border-t border-line pt-3">
                <span className="text-ink">Total</span>
                <span className="text-ink tabular-nums">{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: sold by · bill to · payment */}
        <div
          id="invoice-footer"
          className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line border-t border-line"
        >
          <div className="px-8 py-6">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-3">Sold By</div>
            <div className="text-sm space-y-0.5">
              <div className="text-ink font-medium">wpaxiom</div>
              <div className="text-muted">wpaxiom.com</div>
              <div className="text-muted">support@wpaxiom.com</div>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-3">Bill To</div>
            {hasBillingAddress ? (
              <address className="text-sm not-italic leading-relaxed text-muted space-y-0.5">
                {(billing.first_name || billing.last_name) && (
                  <div className="text-ink font-medium">
                    {[billing.first_name, billing.last_name].filter(Boolean).join(" ")}
                  </div>
                )}
                {billing.company && <div>{billing.company}</div>}
                {billing.address_1 && <div>{billing.address_1}</div>}
                {billing.address_2 && <div>{billing.address_2}</div>}
                {(billing.city || billing.state || billing.postcode) && (
                  <div>
                    {[billing.city, billing.state, billing.postcode].filter(Boolean).join(", ")}
                  </div>
                )}
                {billing.country && <div>{billing.country}</div>}
                {billing.phone && <div className="mt-2">{billing.phone}</div>}
                {billing.email && (
                  <div className={billing.phone ? "" : "mt-2"}>{billing.email}</div>
                )}
              </address>
            ) : (
              <p className="text-sm text-subtle">No billing address on file.</p>
            )}
          </div>

          <div className="px-8 py-6">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-3">Payment</div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Gateway</dt>
                <dd className="text-ink capitalize">{order.gateway}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Amount paid</dt>
                <dd className="text-ink font-semibold tabular-nums">{order.total}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-muted">Status</dt>
                <dd><OrderStatusPill status={order.status} /></dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
