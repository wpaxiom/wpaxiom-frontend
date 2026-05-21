import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, KeyRound, RefreshCw, Download, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { getLicensesForCurrentUser } from "@/lib/account-licenses";
import { getSubscriptionsForCurrentUser } from "@/lib/account-subscriptions";
import { getDownloadsForCurrentUser } from "@/lib/account-downloads";
import { getOrdersForCurrentUser } from "@/lib/account-orders";

export const metadata: Metadata = {
  title: "Account — wpaxiom",
  description: "Your wpaxiom account dashboard.",
};

export default async function AccountIndexPage() {
  const session = await auth();
  const displayName = session?.user?.name?.split(" ")[0] ?? "there";

  const [licenses, subscriptions, downloads, orders] = await Promise.all([
    getLicensesForCurrentUser(),
    getSubscriptionsForCurrentUser(),
    getDownloadsForCurrentUser(),
    getOrdersForCurrentUser(),
  ]);

  const activeLicenses = licenses.filter((l) => l.status === "active");
  const totalSitesUsed = activeLicenses.reduce((sum, l) => sum + l.sites.length, 0);
  const totalSitesMax = activeLicenses.reduce((sum, l) => sum + l.maxSites, 0);
  const nextRenewal = subscriptions[0]?.nextRenewal ?? "—";

  const SUMMARY = [
    {
      Icon: KeyRound,
      label: "Active licenses",
      value: String(activeLicenses.length),
      href: "/account/licenses",
    },
    {
      Icon: RefreshCw,
      label: "Sites in use",
      value: `${totalSitesUsed} / ${totalSitesMax}`,
      href: "/account/licenses",
    },
    {
      Icon: FileText,
      label: "Next renewal",
      value: nextRenewal,
      href: "/account/subscriptions",
    },
    {
      Icon: Download,
      label: "Plugins available",
      value: String(downloads.length),
      href: "/account/downloads",
    },
  ];

  return (
    <>
      <div className="mb-10">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted mb-2">// Account</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          Welcome back, {displayName}.
        </h1>
        <p className="mt-2 text-sm text-muted">
          Quick view of your account. Use the sidebar for everything else.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {SUMMARY.map((card) => {
          const { Icon } = card;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-xl bg-surface border border-line p-5 hover:border-muted/60 transition"
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex bg-elevated border border-line p-2 rounded-lg">
                  <Icon size={16} strokeWidth={1.6} className="text-coral" />
                </div>
                <ArrowRight
                  size={14}
                  strokeWidth={2}
                  className="text-subtle group-hover:text-ink transition"
                />
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight text-ink">{card.value}</div>
              <div className="text-xs text-muted mt-1 font-mono uppercase tracking-wider">{card.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <section className="rounded-2xl border border-line bg-surface p-7">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-lg font-medium tracking-tight text-ink">Recent orders</h2>
            <Link href="/account/orders" className="text-xs text-muted hover:text-ink transition">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-muted">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-line border-y border-line text-sm">
              {orders.slice(0, 3).map((order) => (
                <li key={order.id} className="py-3 flex items-center justify-between gap-4">
                  <span className="text-ink">{order.orderNumber}</span>
                  <span className="text-xs font-mono text-muted">{order.date}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface p-7">
          <h2 className="text-lg font-medium tracking-tight text-ink mb-4">Need a hand?</h2>
          <p className="text-sm text-muted leading-relaxed">
            Pro license holders get a direct line to engineers. Open a support ticket or browse the docs.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-coral hover:bg-coral-hover text-white text-sm font-medium transition focus-coral"
            >
              Open a ticket
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line hover:border-muted text-ink text-sm font-medium transition focus-coral"
            >
              Read the docs
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
