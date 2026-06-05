import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const WP_API = process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export async function POST(req: Request) {
  const session = await auth();
  const wpToken = session?.user?.wpToken;
  const email = session?.user?.email;
  if (!wpToken || !email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { current_password, new_password } = (await req.json()) as {
    current_password?: string;
    new_password?: string;
  };

  if (!current_password || !new_password) {
    return NextResponse.json({ error: "Both passwords are required" }, { status: 400 });
  }

  // Verify current password by attempting a JWT token request
  const verifyRes = await fetch(`${WP_API}/jwt-auth/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username: email, password: current_password }),
    cache: "no-store",
  });

  if (!verifyRes.ok) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  // Update password using the existing session token
  const updateRes = await fetch(`${WP_API}/wp/v2/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${wpToken}`,
    },
    body: JSON.stringify({ password: new_password }),
    cache: "no-store",
  });

  if (!updateRes.ok) {
    const text = await updateRes.text().catch(() => "");
    return NextResponse.json({ error: text.slice(0, 200) }, { status: updateRes.status });
  }

  return NextResponse.json({ ok: true });
}
