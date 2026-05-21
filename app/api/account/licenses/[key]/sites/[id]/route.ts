import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string; id: string }> }
) {
  const session = await auth();
  const token = session?.user?.wpToken;
  if (!token) {
    return NextResponse.json(
      { ok: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { key, id } = await params;
  const url = `${WORDPRESS_API_URL}/wpaxiom/v1/license/${encodeURIComponent(key)}/sites/${encodeURIComponent(id)}`;
  const wpRes = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  const wpBody = await wpRes.json().catch(() => ({}));
  return NextResponse.json(wpBody, { status: wpRes.status });
}
