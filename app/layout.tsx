import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "wpaxiom — WordPress plugins, refined.",
  description:
    "Three plugins. Zero bloat. wpaxiom builds tightly-scoped WordPress tools for developers who care about query count, bundle size, and the next ten years of WordPress.",
  metadataBase: new URL("https://wpaxiom.com"),
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.wpaxiom.com" />
      </head>
      <body className="min-h-screen bg-base text-ink antialiased font-sans" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
