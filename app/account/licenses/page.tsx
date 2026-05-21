import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";
import { LicenseCard } from "@/components/account/LicenseCard";
import { getLicensesForCurrentUser } from "@/lib/account-licenses";

export const metadata: Metadata = {
  title: "Licenses — wpaxiom account",
  description: "Manage your Axiom Blocks Pro license keys and the sites where they're activated.",
};

export default async function LicensesPage() {
  const licenses = await getLicensesForCurrentUser();
  const activeCount = licenses.filter((l) => l.status === "active").length;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted mb-2">// Account</div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Licenses</h1>
          <p className="mt-2 text-sm text-muted">
            Manage license keys and the sites where they&apos;re activated.
          </p>
        </div>
        {licenses.length > 0 && (
          <div className="text-xs font-mono text-subtle">
            {licenses.length} {licenses.length === 1 ? "license" : "licenses"} · {activeCount} active
          </div>
        )}
      </div>

      {licenses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {licenses.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-subtle font-mono">
        Need help? Email <span className="text-muted">support@wpaxiom.com</span> — average reply 4 hours.
      </p>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
      <div className="inline-flex bg-elevated border border-line p-3 rounded-xl mb-4">
        <KeyRound size={20} strokeWidth={1.6} className="text-coral" />
      </div>
      <div className="text-base font-medium text-ink">No licenses yet.</div>
      <p className="mt-2 text-sm text-muted max-w-md mx-auto">
        Once you purchase a Pro plan, your license keys appear here for management. Free plugins
        don&apos;t need a license — install them straight from WordPress.org.
      </p>
      <Link
        href="/plugins/axiom-blocks/pricing"
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium text-sm transition focus-coral"
      >
        Browse Pro plans
        <ArrowRight size={14} strokeWidth={2} />
      </Link>
    </div>
  );
}
