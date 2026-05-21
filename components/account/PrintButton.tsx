"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-muted text-sm text-muted hover:text-ink transition flex-none"
    >
      <Printer size={14} strokeWidth={1.7} />
      Print / Save PDF
    </button>
  );
}
