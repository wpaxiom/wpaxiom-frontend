import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const WP_API = process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export async function PATCH(req: Request) {
  const session = await auth();
  const wpToken = session?.user?.wpToken;
  const email = session?.user?.email;
  if (!wpToken || !email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, company, website } = (await req.json()) as {
    phone?: string;
    company?: string;
    website?: string;
  };

  // Update website in WP
  const wpRes = await fetch(`${WP_API}/wp/v2/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${wpToken}`,
    },
    body: JSON.stringify({ url: website ?? "" }),
    cache: "no-store",
  });

  if (!wpRes.ok) {
    const text = await wpRes.text().catch(() => "");
    return NextResponse.json({ error: text.slice(0, 200) }, { status: wpRes.status });
  }

  // Update phone + company in WC
  if (WC_KEY && WC_SECRET) {
    const basicAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
    const listRes = await fetch(
      `${WP_API}/wc/v3/customers?email=${encodeURIComponent(email)}&per_page=1&role=all`,
      {
        headers: { Accept: "application/json", Authorization: `Basic ${basicAuth}` },
        cache: "no-store",
      }
    );
    if (listRes.ok) {
      const customers = (await listRes.json()) as Array<{ id: number }>;
      const customerId = customers[0]?.id;
      if (customerId) {
        await fetch(`${WP_API}/wc/v3/customers/${customerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify({ billing: { phone: phone ?? "", company: company ?? "" } }),
          cache: "no-store",
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
