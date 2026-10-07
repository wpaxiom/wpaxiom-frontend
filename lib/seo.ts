import type { Metadata } from "next";

export const SITE_URL = "https://wpaxiom.com";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${SITE_URL}/changelog.xml`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "wpaxiom",
      locale: "en_US",
      type,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "wpaxiom — WordPress plugins, refined",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

type SoftwareApplicationOptions = {
  name: string;
  description: string;
  path: string;
  downloadUrl?: string;
  version?: string;
  rating?: string;
  reviewCount?: string;
};

export function softwareApplicationJsonLd({
  name,
  description,
  path,
  downloadUrl,
  version,
  rating,
  reviewCount,
}: SoftwareApplicationOptions) {
  const ratingCount = reviewCount ? Number(reviewCount.replace(/,/g, "")) : 0;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${absoluteUrl(path)}#software`,
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "WordPress plugin",
    operatingSystem: "WordPress",
    author: { "@id": `${SITE_URL}/#organization` },
  };

  if (version) schema.softwareVersion = version;
  if (downloadUrl) {
    schema.downloadUrl = downloadUrl;
    schema.offers = {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: downloadUrl,
    };
  }
  if (rating && ratingCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}
