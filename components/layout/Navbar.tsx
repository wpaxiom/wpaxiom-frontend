import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blogs" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const PLUGIN_LINKS = [
  { href: "/plugins", label: "All plugins" },
  { href: "/plugins/axiom-blocks", label: "Axiom Blocks" },
  { href: "/plugins/cartick", label: "Cartick" },
  { href: "/plugins/specifico", label: "Specifico" },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 focus-coral rounded">
      <Image
        src="/logo-icon.svg"
        alt=""
        width={446}
        height={363}
        className="dark:hidden"
        style={{ height: "28px", width: "auto" }}
        priority
      />
      <Image
        src="/logo-icon-dark.svg"
        alt=""
        width={446}
        height={363}
        className="hidden dark:block"
        style={{ height: "28px", width: "auto" }}
      />
      <span className="text-[19px] font-medium tracking-tight text-ink">wpaxiom</span>
    </Link>
  );
}

function ThemeButton() {
  return (
    <button
      id="theme-toggle"
      type="button"
      aria-label="Switch to light mode"
      className="p-2 rounded-md text-muted hover:text-ink hover:bg-elevated focus-coral transition"
    >
      <Moon aria-hidden="true" size={18} strokeWidth={1.7} className="hidden dark:block" />
      <Sun aria-hidden="true" size={18} strokeWidth={1.7} className="block dark:hidden" />
    </button>
  );
}

function DesktopNavigation() {
  return (
    <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Primary navigation">
      <Link href="/" className="px-3 py-2 text-muted hover:text-ink transition">
        Home
      </Link>
      <details className="group relative">
        <summary className="px-3 py-2 text-muted hover:text-ink transition inline-flex items-center gap-1 focus-coral rounded">
          Plugins
          <ChevronDown
            aria-hidden="true"
            size={14}
            strokeWidth={2}
            className="transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <div className="absolute left-0 top-full pt-2 min-w-[200px]">
          <div className="rounded-xl border border-line bg-surface shadow-2xl shadow-black/40 overflow-hidden py-1">
            {PLUGIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm text-muted hover:text-ink hover:bg-elevated transition focus-coral"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </details>
      {NAV_LINKS.slice(1).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-3 py-2 text-muted hover:text-ink transition"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavigation() {
  return (
    <details className="group md:hidden">
      <summary className="p-2 rounded-md text-muted hover:text-ink hover:bg-elevated focus-coral transition">
        <Menu aria-hidden="true" size={20} strokeWidth={1.8} className="group-open:hidden" />
        <X aria-hidden="true" size={20} strokeWidth={1.8} className="hidden group-open:block" />
        <span className="sr-only">Toggle navigation menu</span>
      </summary>
      <div className="fixed inset-x-0 top-16 bottom-0 z-40 bg-base overflow-y-auto overscroll-contain border-t border-line">
        <nav className="px-6 py-6 flex flex-col" aria-label="Mobile navigation">
          <Link
            href="/"
            className="py-4 text-2xl font-medium tracking-tight text-muted hover:text-ink border-b border-line/60"
          >
            Home
          </Link>
          <div className="border-b border-line/60">
            <div className="pt-4 pb-2 text-2xl font-medium tracking-tight text-ink">Plugins</div>
            <div className="pb-3 pl-3 flex flex-col">
              {PLUGIN_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="py-2 text-base text-muted hover:text-ink">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-4 text-2xl font-medium tracking-tight text-muted hover:text-ink border-b border-line/60"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            className="py-4 text-2xl font-medium tracking-tight text-muted hover:text-ink border-b border-line/60"
          >
            My account
          </Link>
        </nav>
      </div>
    </details>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-base/80 border-b border-line/80">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Brand />
        <DesktopNavigation />
        <div className="flex items-center gap-2">
          <MobileNavigation />
          <ThemeButton />
          <Link
            href="/account"
            className="hidden sm:inline-flex px-3 py-2 text-sm text-muted hover:text-ink transition"
          >
            My account
          </Link>
        </div>
      </div>
    </header>
  );
}
