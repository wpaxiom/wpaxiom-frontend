import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/plugin/Breadcrumb";

type Props = {
  label: string;
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export function LegalPage({ label, title, updatedAt, children }: Props) {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: title }]} />

      <section className="relative overflow-hidden border-b border-line/70">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 hero-grid" />
        <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-14">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// {label}</div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-3 text-sm text-muted font-mono">Last updated: {updatedAt}</p>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="max-w-3xl prose-legal">
          {children}
        </div>
      </section>
    </>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold tracking-tight text-ink mb-4">{title}</h2>
      <div className="space-y-3 text-muted leading-relaxed">{children}</div>
    </div>
  );
}
