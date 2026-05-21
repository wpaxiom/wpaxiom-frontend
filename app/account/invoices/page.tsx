import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getInvoicesForCurrentUser } from "@/lib/account-invoices";

export const metadata: Metadata = {
  title: "Invoices — wpaxiom account",
};

export default async function InvoicesPage() {
  const invoices = await getInvoicesForCurrentUser();

  return (
    <>
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted mb-2">// Account</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Invoices</h1>
        <p className="mt-2 text-sm text-muted">
          Order history and renewal receipts. Download PDFs for your records.
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <div className="text-base font-medium text-ink">No invoices yet.</div>
          <p className="mt-2 text-sm text-muted">
            Once you have a purchase, all receipts and renewal invoices will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <div className="grid grid-cols-[1fr,auto,auto,auto] sm:grid-cols-[1fr,1fr,auto,auto,auto] text-xs font-mono uppercase tracking-wider text-muted px-5 py-3 border-b border-line bg-elevated/40">
            <span>Description</span>
            <span className="hidden sm:inline">Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="text-right">PDF</span>
          </div>
          <ul className="divide-y divide-line">
            {invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="grid grid-cols-[1fr,auto,auto,auto] sm:grid-cols-[1fr,1fr,auto,auto,auto] items-center gap-x-3 px-5 py-4 text-sm"
              >
                <div className="min-w-0">
                  <div className="text-ink truncate">{invoice.description}</div>
                  <div className="text-xs text-subtle font-mono mt-0.5 sm:hidden">{invoice.date}</div>
                </div>
                <div className="hidden sm:block text-muted font-mono">{invoice.date}</div>
                <div className="text-ink font-medium">{invoice.amount}</div>
                <StatusPill status={invoice.status} gateway={invoice.gateway} />
                {invoice.downloadUrl ? (
                  <a
                    href={invoice.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-ink transition p-1.5 rounded focus-coral"
                    aria-label={`Download invoice ${invoice.id}`}
                  >
                    <Download size={14} strokeWidth={1.8} />
                  </a>
                ) : (
                  <span
                    className="text-subtle p-1.5 cursor-not-allowed"
                    title="Invoice PDF not available"
                  >
                    <Download size={14} strokeWidth={1.8} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function StatusPill({
  status,
  gateway,
}: {
  status: "paid" | "refunded" | "failed";
  gateway: "stripe" | "paddle" | "fastspring";
}) {
  const tones = {
    paid: "bg-ok/10 text-ok border-ok/25",
    refunded: "bg-muted/10 text-muted border-line",
    failed: "bg-err/10 text-err border-err/25",
  } as const;
  const labels = { paid: "Paid", refunded: "Refunded", failed: "Failed" } as const;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${tones[status]}`}
      >
        {labels[status]}
      </span>
      <span className="hidden lg:inline text-[10px] font-mono uppercase tracking-wider text-subtle">
        via {gateway}
      </span>
    </div>
  );
}
