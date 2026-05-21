// Dev-only: probes the WP JWT endpoint with the exact bytes provided so we can
// see what /jwt-auth/v1/token returns without going through next-auth's
// callback indirection. Usage:
//
//   GET /api/dev/jwt-probe?u=wpaxiom@gmail.com&p=<password>
//
// Returns the raw status, response body, and a hex-dump of the username so
// invisible characters (zero-width space, NBSP, BOM) become visible.

import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Dev only" }, { status: 404 });
  }

  const u = request.nextUrl.searchParams.get("u") ?? "";
  const p = request.nextUrl.searchParams.get("p") ?? "";
  if (!u || !p) {
    return NextResponse.json(
      { error: "Pass ?u=<email-or-username>&p=<password>" },
      { status: 400 }
    );
  }

  const usernameHex = Array.from(u)
    .map((c) => c.charCodeAt(0).toString(16).padStart(4, "0"))
    .join(" ");

  const res = await fetch(`${WORDPRESS_API_URL}/jwt-auth/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; wpaxiom-frontend/1.0)",
    },
    body: JSON.stringify({ username: u, password: p }),
    cache: "no-store",
  });
  const body = await res.text();

  return NextResponse.json({
    sent: {
      username: u,
      username_hex: usernameHex,
      username_length: u.length,
      password_length: p.length,
    },
    response: {
      status: res.status,
      body: body.slice(0, 2000),
    },
  });
}
