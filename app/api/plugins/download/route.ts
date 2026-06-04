import { NextRequest, NextResponse } from "next/server";
import { validateLicenseSite } from "@/lib/wpaxiom-licenses";
import { generatePresignedDownloadUrl, PLUGIN_R2_KEYS } from "@/lib/r2";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const licenseKey = searchParams.get("license_key");
  const siteUrl = searchParams.get("site_url");
  const plugin = searchParams.get("plugin") ?? "axiom-blocks-pro";

  if (!licenseKey || !siteUrl) {
    return new NextResponse("Missing license_key or site_url", { status: 400 });
  }

  const r2Key = PLUGIN_R2_KEYS[plugin];
  if (!r2Key) {
    return new NextResponse("Unknown plugin", { status: 404 });
  }

  const valid = await validateLicenseSite(licenseKey, siteUrl);
  if (!valid) {
    return new NextResponse("License invalid or inactive", { status: 403 });
  }

  const presignedUrl = await generatePresignedDownloadUrl(r2Key, 60);
  return NextResponse.redirect(presignedUrl, 302);
}
