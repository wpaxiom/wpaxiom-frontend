import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMyLicenses } from "@/lib/wpaxiom-licenses";
import {
  PLUGIN_R2_KEYS,
  productNameToR2Key,
  generatePresignedDownloadUrl,
} from "@/lib/r2";

// Authenticated, per-click plugin download for the account portal.
// Verifies the logged-in user holds an active/grace license that maps to the
// requested plugin, then 302-redirects to a fresh 60s presigned R2 URL.
// Because the URL is minted at click time, the button link never goes stale.
export async function GET(request: NextRequest) {
  const plugin = request.nextUrl.searchParams.get("plugin") ?? "";
  const r2Key = PLUGIN_R2_KEYS[plugin];
  if (!r2Key) {
    return new NextResponse("Unknown plugin", { status: 404 });
  }

  const session = await auth();
  const token = session?.user?.wpToken;
  if (!token) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  // Confirm the user actually owns an active/grace license for this plugin.
  const licenses = await getMyLicenses(token);
  const entitled = licenses.some(
    (lic) =>
      (lic.status === "active" || lic.status === "grace") &&
      productNameToR2Key(lic.product_name ?? "") === r2Key
  );

  if (!entitled) {
    return new NextResponse("No active license for this plugin", { status: 403 });
  }

  try {
    const url = await generatePresignedDownloadUrl(r2Key, 60);
    return NextResponse.redirect(url, 302);
  } catch (e) {
    console.warn(`[api/account/download] presign failed for ${r2Key}:`, e);
    return new NextResponse("Download temporarily unavailable", { status: 502 });
  }
}
