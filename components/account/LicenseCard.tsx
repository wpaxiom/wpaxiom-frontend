"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  Copy,
  Eye,
  EyeOff,
  LayoutGrid,
  Plus,
} from "lucide-react";
import type { License } from "@/lib/account-licenses";

export function LicenseCard({ license }: { license: License }) {
  return <ActiveLicenseCard license={license} />;
}

function ActiveLicenseCard({ license }: { license: License }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(license.autoUpdate);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newDomain, setNewDomain] = useState("https://");
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const sites = license.sites;
  const used = license.timesActivated;
  const max = license.maxSites;
  const percent = max > 0 ? Math.min(100, (used / max) * 100) : 0;
  const renewLabel = formatRenewalDate(license.renewsAt);
  const keyPath = `/api/account/licenses/${encodeURIComponent(license.licenseKey)}/sites`;

  function copyKey() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(license.licenseKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  async function submitNewSite(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = newDomain.trim();
    if (!/^https?:\/\/.+\..+/i.test(trimmed)) {
      setError("Enter a valid URL (e.g. https://yoursite.com).");
      return;
    }
    const host = stripHost(trimmed);
    if (sites.some((s) => stripHost(s.domain) === host)) {
      setError("This domain is already activated on this license.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(keyPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_url: trimmed }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        code?: string;
      };
      if (!res.ok || !body.ok) {
        setError(body.message ?? "Activation failed.");
        return;
      }
      setAdding(false);
      setNewDomain("https://");
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeSite(activationId: number) {
    if (typeof window !== "undefined" && !window.confirm("Deactivate this site?")) {
      return;
    }
    setError(null);
    setRemovingId(activationId);
    try {
      const res = await fetch(`${keyPath}/${activationId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setError(body.message ?? "Could not deactivate site.");
        return;
      }
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <article className="rounded-2xl border border-line bg-surface overflow-hidden">
      <header className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-line">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-elevated border border-line flex items-center justify-center flex-none">
            <LayoutGrid size={20} strokeWidth={1.7} className="text-coral" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-medium text-ink tracking-tight">{license.pluginName}</h2>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-coral/15 text-coral border border-coral/30">
                {license.planLabel}
              </span>
              <StatusBadge status={license.status} />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-mono uppercase tracking-wider text-subtle">Renews</div>
          <div className="text-sm text-ink mt-0.5">{renewLabel}</div>
          <Link
            href="/account/subscriptions"
            className="mt-1 inline-block text-xs text-muted hover:text-ink underline-offset-4 hover:underline"
          >
            Manage subscription →
          </Link>
        </div>
      </header>

      <div className="p-6 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono uppercase tracking-[0.16em] text-muted">License key</label>
            {license.orderId && (
              <span className="text-[11px] font-mono text-subtle">Order #{license.orderId}</span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 px-4 py-3 rounded-lg bg-base border border-line font-mono text-sm text-ink tracking-wider truncate">
              {keyVisible ? license.licenseKey : license.maskedKey}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setKeyVisible((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line bg-surface hover:border-muted text-sm text-ink transition focus-coral"
                aria-label={keyVisible ? "Hide license key" : "Show license key"}
              >
                {keyVisible ? <EyeOff size={14} strokeWidth={1.8} /> : <Eye size={14} strokeWidth={1.8} />}
                {keyVisible ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                onClick={copyKey}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line bg-surface hover:border-muted text-sm text-ink transition focus-coral"
              >
                {copied ? (
                  <>
                    <Check size={14} strokeWidth={2.2} className="text-ok" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} strokeWidth={1.8} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between mb-2">
            <label className="text-xs font-mono uppercase tracking-[0.16em] text-muted">
              Activated sites
            </label>
            <div className="text-xs font-mono text-muted">
              <span className="text-ink">{used}</span> / {max} used
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
            <div className="h-full bg-coral rounded-full transition-all" style={{ width: `${percent}%` }} />
          </div>

          <ul className="mt-5 divide-y divide-line border border-line rounded-lg overflow-hidden">
            {sites.map((site) => (
              <li
                key={site.id}
                className="flex items-center justify-between gap-4 px-4 py-3 bg-base/40 hover:bg-base/70 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full flex-none ${site.status === "active" ? "bg-ok" : "bg-subtle"}`}
                  />
                  <span className="font-mono text-sm text-ink truncate">{site.domain}</span>
                </div>
                <div className="flex items-center gap-3 flex-none">
                  <span className="text-xs text-subtle font-mono hidden sm:inline">
                    {formatActivatedAt(site.activatedAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSite(site.id)}
                    disabled={removingId === site.id || isPending}
                    className="text-xs text-muted hover:text-err transition px-2 py-1 rounded disabled:opacity-50"
                  >
                    {removingId === site.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </li>
            ))}
            {sites.length === 0 && (
              <li className="px-4 py-6 bg-base/40 text-sm text-muted text-center">
                No sites activated yet. Add your first below.
              </li>
            )}
          </ul>

          {!adding ? (
            <button
              type="button"
              onClick={() => {
                setAdding(true);
                setError(null);
              }}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-line text-sm text-muted hover:text-ink hover:border-muted transition focus-coral"
              disabled={used >= max}
            >
              <Plus size={14} strokeWidth={2} />
              {used >= max ? "All site slots used" : "Add site"}
            </button>
          ) : (
            <form
              onSubmit={submitNewSite}
              className="mt-3 p-4 rounded-lg border border-line bg-base/40"
              noValidate
            >
              <label
                htmlFor={`new-site-${license.id}`}
                className="text-xs font-mono uppercase tracking-[0.16em] text-muted mb-2 block"
              >
                New site URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id={`new-site-${license.id}`}
                  type="text"
                  value={newDomain}
                  onChange={(e) => {
                    setNewDomain(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://yournewsite.com"
                  className={`flex-1 px-4 py-2.5 rounded-lg bg-base border font-mono text-sm text-ink placeholder:text-subtle focus:outline-none transition ${
                    error ? "border-err/60 focus:border-err" : "border-line focus:border-coral"
                  }`}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-coral hover:bg-coral-hover text-white text-sm font-medium transition focus-coral disabled:opacity-60"
                  >
                    {submitting ? "Activating…" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdding(false);
                      setError(null);
                      setNewDomain("https://");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-line bg-surface hover:border-muted text-sm text-ink transition focus-coral"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-err">
                  <AlertCircle size={13} strokeWidth={2} />
                  {error}
                </div>
              )}
            </form>
          )}
        </section>

        <section className="pt-2 border-t border-line flex items-center justify-between gap-6">
          <div>
            <div className="text-sm text-ink">Auto-updates</div>
            <div className="mt-0.5 text-xs text-muted">
              Plugin updates delivered automatically to all activated sites.
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoUpdate}
            onClick={() => setAutoUpdate((v) => !v)}
            className={`relative inline-flex w-11 h-6 rounded-full focus-coral transition ${
              autoUpdate ? "bg-coral" : "bg-elevated border border-line"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                autoUpdate ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </section>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: License["status"] }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-ok/10 text-ok border border-ok/25">
          <span className="w-1.5 h-1.5 rounded-full bg-ok" /> Active
        </span>
      );
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-info/10 text-info border border-info/25">
          <span className="w-1.5 h-1.5 rounded-full bg-info" /> Delivered
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-elevated text-muted border border-line">
          <span className="w-1.5 h-1.5 rounded-full bg-muted" /> Inactive
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-warn/10 text-warn border border-warn/25">
          <span className="w-1.5 h-1.5 rounded-full bg-warn" /> Expired
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-err/10 text-err border border-err/25">
          <span className="w-1.5 h-1.5 rounded-full bg-err" /> Cancelled
        </span>
      );
    default:
      return null;
  }
}

function stripHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function formatRenewalDate(value: string | null): string {
  if (!value) return "—";
  const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatActivatedAt(value: string): string {
  const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
