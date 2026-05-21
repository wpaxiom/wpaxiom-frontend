"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavItem =
  | { type: "link"; href: string; label: string }
  | { type: "menu"; key: string; label: string; items: { href: string; label: string }[] };

const NAV_ITEMS: NavItem[] = [
  { type: "link", href: "/", label: "Home" },
  {
    type: "menu",
    key: "plugins",
    label: "Plugins",
    items: [
      { href: "/plugins", label: "All plugins" },
      { href: "/plugins/axiom-blocks", label: "Axiom Blocks" },
      { href: "/plugins/cartick", label: "Cartick" },
      { href: "/plugins/specifico", label: "Specifico" },
    ],
  },
  { type: "link", href: "/blog", label: "Blogs" },
  { type: "link", href: "/docs", label: "Docs" },
  { type: "link", href: "/changelog", label: "Changelog" },
  { type: "link", href: "/about", label: "About" },
  { type: "link", href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setOpenMenu(null);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    function handleClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenu]);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-base/80 border-b border-line/80">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 focus-coral rounded">
            <Image src="/logo-icon.svg" alt="" width={446} height={363} className="dark:hidden" style={{ height: '28px', width: 'auto' }} priority />
            <Image src="/logo-icon-dark.svg" alt="" width={446} height={363} className="hidden dark:block" style={{ height: '28px', width: 'auto' }} />
            <span className="text-[19px] font-medium tracking-tight text-ink">wpaxiom</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV_ITEMS.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-muted hover:text-ink transition"
                >
                  {item.label}
                </Link>
              ) : (
                <DropdownMenu
                  key={item.key}
                  item={item}
                  isOpen={openMenu === item.key}
                  onToggle={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                  onClose={() => setOpenMenu(null)}
                  containerRef={openMenu === item.key ? dropdownRef : null}
                />
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded-md text-muted hover:text-ink hover:bg-elevated focus-coral transition"
            >
              <Menu size={20} strokeWidth={1.8} />
            </button>
            <ThemeToggle />
            <Link
              href="/account"
              className="hidden sm:inline-flex px-3 py-2 text-sm text-muted hover:text-ink transition"
            >
              My account
            </Link>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <MobileDrawer items={NAV_ITEMS} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}

type DropdownMenuProps = {
  item: Extract<NavItem, { type: "menu" }>;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement | null> | null;
};

function DropdownMenu({ item, isOpen, onToggle, onClose, containerRef }: DropdownMenuProps) {
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="px-3 py-2 text-muted hover:text-ink transition inline-flex items-center gap-1 focus-coral rounded"
      >
        {item.label}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full pt-2 min-w-[200px]" role="menu">
          <div className="rounded-xl border border-line bg-surface shadow-2xl shadow-black/40 overflow-hidden py-1">
            {item.items.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                role="menuitem"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-muted hover:text-ink hover:bg-elevated transition focus-coral"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function MobileDrawer({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] bg-base md:hidden overflow-y-auto">
      <div className="h-16 px-6 flex items-center justify-between border-b border-line sticky top-0 bg-base">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <Image src="/logo-icon.svg" alt="" width={446} height={363} className="dark:hidden" style={{ height: '28px', width: 'auto' }} />
          <Image src="/logo-icon-dark.svg" alt="" width={446} height={363} className="hidden dark:block" style={{ height: '28px', width: 'auto' }} />
          <span className="text-[19px] font-medium tracking-tight text-ink">wpaxiom</span>
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="p-2 rounded-md text-muted hover:text-ink hover:bg-elevated focus-coral transition"
        >
          <X size={22} strokeWidth={1.8} />
        </button>
      </div>
      <nav className="px-6 py-6 flex flex-col">
        {items.map((item) =>
          item.type === "link" ? (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="py-4 text-2xl font-medium tracking-tight text-muted hover:text-ink border-b border-line/60"
            >
              {item.label}
            </Link>
          ) : (
            <div key={item.key} className="border-b border-line/60">
              <div className="pt-4 pb-2 text-2xl font-medium tracking-tight text-ink">{item.label}</div>
              <div className="pb-3 pl-3 flex flex-col">
                {item.items.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={onClose}
                    className="py-2 text-base text-muted hover:text-ink"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
        <Link
          href="/account"
          onClick={onClose}
          className="py-4 text-2xl font-medium tracking-tight text-muted hover:text-ink border-b border-line/60"
        >
          My account
        </Link>
      </nav>
    </div>
  );
}
