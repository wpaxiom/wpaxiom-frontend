import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const WP_API = process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export async function PATCH(req: Request) {
  const session = await auth();
  const wpToken = session?.user?.wpToken;
  if (!wpToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { first_name, last_name, display_name } = (await req.json()) as {
    first_name?: string;
    last_name?: string;
    display_name?: string;
  };

  const res = await fetch(`${WP_API}/wp/v2/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${wpToken}`,
    },
    body: JSON.stringify({ first_name, last_name, name: display_name }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({ error: text.slice(0, 200) }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
