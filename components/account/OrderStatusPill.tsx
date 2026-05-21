import type { Order } from "@/lib/account-orders";

const tones: Record<Order["status"], string> = {
  pending: "bg-warn/10 text-warn border-warn/25",
  processing: "bg-info/10 text-info border-info/25",
  completed: "bg-ok/10 text-ok border-ok/25",
  cancelled: "bg-muted/10 text-muted border-line",
  refunded: "bg-muted/10 text-muted border-line",
  failed: "bg-err/10 text-err border-err/25",
};

const labels: Record<Order["status"], string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Failed",
};

export function OrderStatusPill({ status }: { status: Order["status"] }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${tones[status] ?? "bg-muted/10 text-muted border-line"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
