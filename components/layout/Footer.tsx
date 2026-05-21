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
];

const IMPORTANT_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/donate", label: "Buy me a coffee" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/refund-policy", label: "Refund policy" },
];

const CONNECT_LINKS = [
  { href: "https://github.com/wpaxiom", label: "GitHub" },
  { href: "https://twitter.com/wpaxiom", label: "X / Twitter" },
  { href: "https://profiles.wordpress.org/wpaxiom/", label: "WP.org profile" },
];

function WordPressIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96.24 96.24" fill="currentColor" aria-hidden="true">
      <path d="M48.122,0C21.587,0,0.001,21.585,0.001,48.118c0,26.535,21.587,48.122,48.12,48.122c26.532,0,48.117-21.587,48.117-48.122C96.239,21.586,74.654,0,48.122,0z M4.857,48.118c0-6.271,1.345-12.227,3.746-17.606l20.638,56.544C14.81,80.042,4.857,65.243,4.857,48.118z M48.122,91.385c-4.247,0-8.346-0.623-12.222-1.763L48.88,51.903l13.301,36.433c0.086,0.215,0.191,0.411,0.308,0.596C57.992,90.514,53.16,91.385,48.122,91.385z M54.083,27.834c2.604-0.137,4.953-0.412,4.953-0.412c2.33-0.276,2.057-3.701-0.277-3.564c0,0-7.007,0.549-11.532,0.549c-4.25,0-11.396-0.549-11.396-0.549c-2.332-0.137-2.604,3.427-0.273,3.564c0,0,2.208,0.275,4.537,0.412l6.74,18.469l-9.468,28.395L21.615,27.835c2.608-0.136,4.952-0.412,4.952-0.412c2.33-0.275,2.055-3.702-0.278-3.562c0,0-7.004,0.549-11.53,0.549c-0.813,0-1.77-0.021-2.784-0.052C19.709,12.611,33.008,4.856,48.122,4.856c11.265,0,21.519,4.306,29.215,11.357c-0.187-0.01-0.368-0.035-0.562-0.035c-4.248,0-7.264,3.702-7.264,7.679c0,3.564,2.055,6.582,4.248,10.146c1.647,2.882,3.567,6.585,3.567,11.932c0,3.704-1.422,8-3.293,13.986l-4.315,14.421L54.083,27.834z M69.871,85.516l13.215-38.208c2.471-6.171,3.29-11.106,3.29-15.497c0-1.591-0.104-3.07-0.292-4.449c3.38,6.163,5.303,13.236,5.301,20.758C91.384,64.08,82.732,78.016,69.871,85.516z" />
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
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded border border-line text-muted">
                Paddle
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
                    <Link href={link.href} className="hover:text-ink transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.18em] text-subtle mb-4">Important Links</h4>
              <ul className="space-y-2.5 text-muted">
                {IMPORTANT_LINKS.map((link) => (
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
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
