import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const WP_API = process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export async function PATCH(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!WC_KEY || !WC_SECRET) {
    return NextResponse.json({ error: "WC credentials not configured" }, { status: 503 });
  }

  const { address1, address2, city, state, postcode, country } = (await req.json()) as {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };

  const basicAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

  const listRes = await fetch(
    `${WP_API}/wc/v3/customers?email=${encodeURIComponent(email)}&per_page=1&role=all`,
    {
      headers: { Accept: "application/json", Authorization: `Basic ${basicAuth}` },
      cache: "no-store",
    }
  );
  if (!listRes.ok) return NextResponse.json({ error: "Could not fetch customer" }, { status: 502 });

  const customers = (await listRes.json()) as Array<{ id: number }>;
  const customerId = customers[0]?.id;
  if (!customerId) return NextResponse.json({ error: "WC customer not found" }, { status: 404 });

  const putRes = await fetch(`${WP_API}/wc/v3/customers/${customerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify({
      billing: {
        address_1: address1 ?? "",
        address_2: address2 ?? "",
        city: city ?? "",
        state: state ?? "",
        postcode: postcode ?? "",
        country: country ?? "",
      },
    }),
    cache: "no-store",
  });

  if (!putRes.ok) {
    const text = await putRes.text().catch(() => "");
    return NextResponse.json({ error: text.slice(0, 200) }, { status: putRes.status });
  }

  return NextResponse.json({ ok: true });
}
