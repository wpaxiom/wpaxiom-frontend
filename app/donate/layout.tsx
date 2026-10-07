import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Support wpaxiom — Buy us a coffee",
  description: "Support the continued development of wpaxiom's free, open-source WordPress plugins.",
  path: "/donate",
});

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
