import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support wpaxiom — Buy us a coffee",
  description: "Support the continued development of wpaxiom's free, open-source WordPress plugins.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}

