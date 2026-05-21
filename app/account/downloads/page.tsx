import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getDownloadsForCurrentUser } from "@/lib/account-downloads";

export const metadata: Metadata = {
  title: "Downloads — wpaxiom account",
};

export default async function DownloadsPage() {
  const items = await getDownloadsForCurrentUser();

  return (
    <>
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted mb-2">// Account</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Downloads</h1>
        <p className="mt-2 text-sm text-muted">
          Latest plugin builds. Download links are signed and expire 15 minutes after generation.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <div className="text-base font-medium text-ink">No downloads yet.</div>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            Downloads appear here after you purchase a plugin. Free plugins are available on
            WordPress.org.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-elevated border border-line flex items-center justify-center flex-none">
                    <Download size={18} strokeWidth={1.7} className="text-coral" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{item.pluginName}</div>
                    <div className="text-xs text-muted font-mono mt-1">
                      {item.version ? `v${item.version}` : "Latest"}
                      {item.releasedAt ? ` · Released ${item.releasedAt}` : ""}
                    </div>
                  </div>
                </div>
                {item.available ? (
                  <a
                    href={item.downloadUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-muted text-ink text-sm transition focus-coral self-start sm:self-auto"
                  >
                    <Download size={14} strokeWidth={1.8} />
                    Download .zip
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line text-muted text-sm self-start sm:self-auto opacity-50 cursor-not-allowed"
                  >
                    <Download size={14} strokeWidth={1.8} />
                    Unavailable
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-subtle font-mono">
        Want a specific old version? Email support — we keep all releases.
      </p>
    </>
  );
}
