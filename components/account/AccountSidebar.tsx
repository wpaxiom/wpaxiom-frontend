"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  KeyRound,
  RefreshCw,
  Download,
  FileText,
  User,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarUser = {
  name: string;
  email: string;
  initials: string;
  avatarUrl: string;
};

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/account/licenses", label: "Licenses", Icon: KeyRound },
  { href: "/account/subscriptions", label: "Subscriptions", Icon: RefreshCw },
  { href: "/account/downloads", label: "Downloads", Icon: Download },
  { href: "/account/orders", label: "Orders", Icon: FileText },
  { href: "/account/profile", label: "Profile", Icon: User },
];

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  return pathname.startsWith(href + "/");
}

export function AccountSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const [imgError, setImgError] = useState(false);

  return (
    <aside className="hidden md:block w-[220px] flex-none">
      <div className="rounded-xl border border-line bg-surface overflow-hidden sticky top-24">
        <div className="p-4 flex items-center gap-3 border-b border-line">
          {user.avatarUrl && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              width={40}
              height={40}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-full object-cover border border-line flex-none"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-elevated border border-line flex items-center justify-center text-sm font-mono text-coral flex-none">
              {user.initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm text-ink truncate">{user.name}</div>
            <div className="text-xs text-muted truncate font-mono">{user.email}</div>
          </div>
        </div>

        <nav className="py-2 text-sm">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "relative flex items-center gap-2.5 px-4 py-2.5 text-ink bg-elevated/60"
                    : "flex items-center gap-2.5 px-4 py-2.5 text-muted hover:text-ink hover:bg-elevated/40 transition"
                }
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-coral" />
                )}
                <Icon size={15} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}

          <div className="my-2 border-t border-line" />

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-err/90 hover:text-err hover:bg-err/5 transition text-left"
          >
            <LogOut size={15} strokeWidth={1.8} />
            Log out
          </button>
        </nav>
      </div>
    </aside>
  );
}

export function AccountTabBar() {
  const pathname = usePathname();

  return (
    <div className="md:hidden border-b border-line bg-surface/40 sticky top-16 z-40 backdrop-blur-md">
      <nav className="flex items-center gap-1 px-4 py-2 overflow-x-auto no-scrollbar text-sm">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "px-3 py-2 rounded-md bg-elevated border border-line text-ink whitespace-nowrap inline-flex items-center gap-1.5"
                  : "px-3 py-2 text-muted hover:text-ink whitespace-nowrap"
              }
            >
              {active && <span className="w-1 h-1 rounded-full bg-coral" />}
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-3 py-2 text-err/90 hover:text-err whitespace-nowrap"
        >
          Log out
        </button>
      </nav>
    </div>
  );
}
