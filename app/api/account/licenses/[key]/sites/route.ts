import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await auth();
  const token = session?.user?.wpToken;
  if (!token) {
    return NextResponse.json(
      { ok: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { key } = await params;
  const body = (await req.json().catch(() => ({}))) as { site_url?: string };
  const siteUrl = String(body.site_url ?? "").trim();
  if (!siteUrl) {
    return NextResponse.json(
      { ok: false, message: "site_url required" },
      { status: 400 }
    );
  }

  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/license/${encodeURIComponent(key)}/sites`;
  const wpRes = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ site_url: siteUrl }),
    cache: "no-store",
  });
  const wpBody = await wpRes.json().catch(() => ({}));
  return NextResponse.json(wpBody, { status: wpRes.status });
}
