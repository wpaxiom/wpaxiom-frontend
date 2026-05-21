import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ trail }: { trail: BreadcrumbItem[] }) {
  return (
    <div className="border-b border-line/60">
      <nav
        aria-label="Breadcrumb"
        className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-2 text-xs font-mono text-muted"
      >
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <span key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-subtle">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-ink transition">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink">{item.label}</span>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
