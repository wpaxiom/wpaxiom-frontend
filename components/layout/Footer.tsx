import Image from "next/image";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

const PRODUCT_LINKS = [
  { href: "/plugins/cartick", label: "Cartick" },
  { href: "/plugins/specifico", label: "Specifico" },
  { href: "/plugins/axiom-blocks", label: "Axiom Blocks" },
];

const RESOURCE_LINKS = [
  { href: "/docs", label: "Documentation" },
  { href: "/blog", label: "Blog" },
  { href: "/changelog", label: "Changelog" },
  { href: "https://wordpress.org/", label: "WordPress.org", external: true },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund policy" },
];

const CONNECT_LINKS = [
  { href: "https://github.com/wpaxiom", label: "GitHub" },
  { href: "https://twitter.com/wpaxiom", label: "X / Twitter" },
  { href: "https://profiles.wordpress.org/wpaxiom/", label: "WP.org profile" },
  { href: "/newsletter", label: "Newsletter" },
];

function WordPressIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.06 17.5-4.4-7.62 4.4 1.18Zm1.06 0V13.06l4.4-1.18Zm0-7.6L7.7 11l3.24-7.5Zm1.06 0V3.5L16.3 11Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-base border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo-icon.svg" alt="" width={446} height={363} className="dark:hidden" style={{ height: '28px', width: 'auto' }} />
              <Image src="/logo-icon-dark.svg" alt="" width={446} height={363} className="hidden dark:block" style={{ height: '28px', width: 'auto' }} />
              <span className="text-[19px] font-medium tracking-tight text-ink">wpaxiom</span>
            </Link>
            <p className="mt-5 text-sm text-muted leading-relaxed max-w-sm">
              Tightly-scoped WordPress plugins for developers who care about query count, bundle size, and the
              next ten years of the platform.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com/wpaxiom"
                aria-label="GitHub"
                className="w-9 h-9 rounded-md border border-line text-muted hover:text-ink hover:border-muted flex items-center justify-center transition focus-coral"
              >
                <Github size={16} />
              </a>
              <a
                href="https://twitter.com/wpaxiom"
                aria-label="X / Twitter"
                className="w-9 h-9 rounded-md border border-line text-muted hover:text-ink hover:border-muted flex items-center justify-center transition focus-coral"
              >
                <Twitter size={14} />
              </a>
              <a
                href="https://profiles.wordpress.org/wpaxiom/"
                aria-label="WordPress.org"
                className="w-9 h-9 rounded-md border border-line text-muted hover:text-ink hover:border-muted flex items-center justify-center transition focus-coral"
              >
                <WordPressIcon />
              </a>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded border border-line text-muted">
                Stripe
              </span>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded border border-line text-muted">
                FastSpring
              </span>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 text-sm">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.18em] text-subtle mb-4">Products</h4>
              <ul className="space-y-2.5 text-muted">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-ink transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.18em] text-subtle mb-4">Resources</h4>
              <ul className="space-y-2.5 text-muted">
                {RESOURCE_LINKS.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} className="hover:text-ink transition">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-ink transition">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.18em] text-subtle mb-4">Company</h4>
              <ul className="space-y-2.5 text-muted">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-ink transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.18em] text-subtle mb-4">Connect</h4>
              <ul className="space-y-2.5 text-muted">
                {CONNECT_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-ink transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-subtle font-mono">
          <span>© 2026 wpaxiom. Built for WordPress developers.</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ok" />
            All systems operational · status.wpaxiom.com
          </span>
        </div>
      </div>
    </footer>
  );
}
