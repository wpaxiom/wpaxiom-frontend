import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  title: "wpaxiom — WordPress plugins, refined.",
  description:
    "Three plugins. Zero bloat. wpaxiom builds tightly-scoped WordPress tools for developers who care about query count, bundle size, and the next ten years of WordPress.",
  metadataBase: new URL("https://wpaxiom.com"),
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://wpaxiom.com/changelog.xml",
    },
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://wpaxiom.com/#organization",
      name: "wpaxiom",
      url: "https://wpaxiom.com",
      logo: "https://wpaxiom.com/logo-icon.svg",
      email: "support@wpaxiom.com",
      sameAs: [
        "https://github.com/wpaxiom",
        "https://profiles.wordpress.org/wpaxiom/",
        "https://twitter.com/wpaxiom",
        "https://www.youtube.com/@WPAxiom",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://wpaxiom.com/#website",
      url: "https://wpaxiom.com",
      name: "wpaxiom",
      description:
        "Tightly-scoped WordPress plugins for developers who care about performance, maintainability, and accessibility.",
      publisher: { "@id": "https://wpaxiom.com/#organization" },
      inLanguage: "en",
    },
  ],
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('wpaxiom-theme');
    var theme = stored === 'light' ? 'light' : 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

const themeToggleScript = `
(function () {
  var button = document.getElementById('theme-toggle');
  if (!button) return;

  function updateLabel() {
    var isDark = document.documentElement.classList.contains('dark');
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  button.addEventListener('click', function () {
    var isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('wpaxiom-theme', isDark ? 'dark' : 'light');
    } catch (e) {}
    updateLabel();
  });

  updateLabel();
})();
`;

const googleAnalyticsId = "G-HBB3LGGY1Y";

const googleAnalyticsScript = `
(function () {
  var loaded = false;
  var scheduled = false;
  var events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];

  function loadGoogleAnalytics() {
    if (loaded) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}';
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', '${googleAnalyticsId}', { anonymize_ip: true });
  }

  function scheduleGoogleAnalytics() {
    if (loaded || scheduled) return;
    scheduled = true;
    events.forEach(function (eventName) {
      window.removeEventListener(eventName, scheduleGoogleAnalytics);
    });

    window.setTimeout(function () {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadGoogleAnalytics, { timeout: 2000 });
      } else {
        loadGoogleAnalytics();
      }
    }, 1000);
  }

  events.forEach(function (eventName) {
    window.addEventListener(eventName, scheduleGoogleAnalytics, { once: true, passive: true });
  });

  window.setTimeout(scheduleGoogleAnalytics, 15000);
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="describedby" href="/llms.txt" type="text/markdown" />
      </head>
      <body className="min-h-screen bg-base text-ink antialiased font-sans" suppressHydrationWarning>
        <JsonLd data={siteSchema} />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <script id="google-analytics" dangerouslySetInnerHTML={{ __html: googleAnalyticsScript }} />
        <script id="theme-toggle-handler" dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
      </body>
    </html>
  );
}
