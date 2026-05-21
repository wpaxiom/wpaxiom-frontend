import { Check, X } from "lucide-react";

type Cell = { type: "check" } | { type: "cross" } | { type: "text"; value: string; tone?: "default" | "coral" | "muted" };

type Row = {
  label: string;
  free: Cell;
  pro: Cell;
};

type Section = {
  title: string;
  rows: Row[];
};

const SECTIONS: Section[] = [
  {
    title: "Blocks",
    rows: [
      { label: "Core blocks (12 essentials)", free: { type: "check" }, pro: { type: "check" } },
      { label: "Pro blocks (30 advanced)", free: { type: "cross" }, pro: { type: "check" } },
      {
        label: "Block patterns library",
        free: { type: "text", value: "20 patterns", tone: "muted" },
        pro: { type: "text", value: "200+ patterns", tone: "coral" },
      },
    ],
  },
  {
    title: "Query & dynamic content",
    rows: [
      { label: "Standard Query Loop", free: { type: "check" }, pro: { type: "check" } },
      { label: "Query Loop Pro (ACF, taxonomies, meta)", free: { type: "cross" }, pro: { type: "check" } },
      { label: "Dynamic attribute binding", free: { type: "cross" }, pro: { type: "check" } },
      { label: "Conditional visibility rules", free: { type: "cross" }, pro: { type: "check" } },
    ],
  },
  {
    title: "Workflow & support",
    rows: [
      { label: "White-label mode", free: { type: "cross" }, pro: { type: "check" } },
      { label: "Auto-updates", free: { type: "check" }, pro: { type: "check" } },
      {
        label: "Support",
        free: { type: "text", value: "Community forum", tone: "muted" },
        pro: { type: "text", value: "Priority email · 4hr SLA", tone: "coral" },
      },
      {
        label: "License sites",
        free: { type: "text", value: "Unlimited (free use)", tone: "muted" },
        pro: { type: "text", value: "1 / 5 / 10 site plans", tone: "coral" },
      },
    ],
  },
];

function CellContent({ cell }: { cell: Cell }) {
  if (cell.type === "check") {
    return <Check size={18} strokeWidth={2.2} className="text-ok" />;
  }
  if (cell.type === "cross") {
    return <X size={18} strokeWidth={2} className="text-subtle" />;
  }
  const className =
    cell.tone === "coral"
      ? "text-coral font-mono text-xs"
      : cell.tone === "muted"
      ? "text-muted font-mono text-xs"
      : "text-ink";
  return <span className={className}>{cell.value}</span>;
}

export function FreeVsPro() {
  const flatRows: Array<{ kind: "section"; title: string } | { kind: "row"; row: Row }> = [];
  for (const section of SECTIONS) {
    flatRows.push({ kind: "section", title: section.title });
    for (const row of section.rows) {
      flatRows.push({ kind: "row", row });
    }
  }

  return (
    <section className="border-b border-line/70 bg-surface/30">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Free vs Pro</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            A generous free plugin. A more capable Pro.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            The free version is a complete product. Pro adds the things agencies and power users keep asking for.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-base overflow-hidden">
          <div className="grid grid-cols-[1.5fr,1fr,1fr] text-sm">
            <div className="px-6 py-5 border-b border-line" />
            <div className="px-6 py-5 border-b border-l border-line">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted">Free</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-ink">$0</div>
              <div className="text-xs text-muted mt-0.5">forever, on WP.org</div>
            </div>
            <div className="px-6 py-5 border-b border-l border-line bg-coral/[0.04] relative">
              <span className="absolute -top-px right-4 px-2 py-0.5 rounded-b-md bg-coral text-white text-[10px] font-mono uppercase tracking-wider">
                Recommended
              </span>
              <div className="text-[11px] font-mono uppercase tracking-wider text-coral">Pro</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-ink">
                From $7<span className="text-base text-muted font-normal">/mo</span>
              </div>
              <div className="text-xs text-muted mt-0.5">5 sites, billed yearly</div>
            </div>

            {flatRows.map((entry, index) => {
              if (entry.kind === "section") {
                return (
                  <div
                    key={`section-${entry.title}`}
                    className="col-span-3 px-6 py-3 border-b border-line bg-elevated/40 text-[11px] font-mono uppercase tracking-wider text-muted"
                  >
                    {entry.title}
                  </div>
                );
              }
              const { row } = entry;
              const isLast = index === flatRows.length - 1;
              const borderClass = isLast ? "" : "border-b";
              return (
                <RowFragment key={`row-${row.label}`} row={row} borderClass={borderClass} />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function RowFragment({ row, borderClass }: { row: Row; borderClass: string }) {
  return (
    <>
      <div className={`px-6 py-4 ${borderClass} border-line text-ink`}>{row.label}</div>
      <div className={`px-6 py-4 ${borderClass} border-l border-line`}>
        <CellContent cell={row.free} />
      </div>
      <div className={`px-6 py-4 ${borderClass} border-l border-line bg-coral/[0.04]`}>
        <CellContent cell={row.pro} />
      </div>
    </>
  );
}
