import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { recordDocFeedback } from "@/lib/wpaxiom-admin";

type Body = { plugin?: string; slug?: string; vote?: "yes" | "no" };

// Hash the visitor IP so WP can do coarse abuse control without ever storing a
// raw address. Salted with the admin secret; if we can't resolve an IP we just
// omit it (the column is nullable).
function hashIp(request: NextRequest): string | undefined {
  const fwd = request.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  if (!ip) return undefined;
  const salt = process.env.WPAXIOM_ADMIN_SECRET ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { plugin, slug, vote } = body;
  if (!plugin || !slug || (vote !== "yes" && vote !== "no")) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  await recordDocFeedback({ plugin, slug, vote, ipHash: hashIp(request) });

  // Always 200 — feedback is best-effort and must never surface an error to the
  // beacon. A failed WP write is logged server-side by recordDocFeedback.
  return NextResponse.json({ ok: true });
}
