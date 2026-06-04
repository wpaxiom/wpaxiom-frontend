import { NextRequest, NextResponse } from "next/server";
import { validateLicenseSite } from "@/lib/wpaxiom-licenses";
import { PLUGIN_R2_KEYS, getPluginVersions } from "@/lib/r2";

const PLUGIN_META: Record<string, { requires: string; tested: string; requires_php: string; url: string }> = {
  "axiom-blocks-pro": {
    requires: "6.0",
    tested: "6.7",
    requires_php: "7.4",
    url: "https://wpaxiom.com",
  },
};

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return na > nb ? 1 : -1;
  }
  return 0;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const licenseKey = searchParams.get("license_key");
  const siteUrl = searchParams.get("site_url");
  const plugin = searchParams.get("plugin") ?? "axiom-blocks-pro";
  const clientVersion = searchParams.get("version") ?? "0.0.0";

  if (!licenseKey || !siteUrl) {
    return NextResponse.json(
      { error: "license_key and site_url required" },
      { status: 400 }
    );
  }

  if (!PLUGIN_R2_KEYS[plugin]) {
    return NextResponse.json({ error: "unknown_plugin" }, { status: 404 });
  }

  const valid = await validateLicenseSite(licenseKey, siteUrl);
  if (!valid) {
    return NextResponse.json({ error: "invalid_license" }, { status: 403 });
  }

  const meta = PLUGIN_META[plugin];
  const versions = await getPluginVersions();
  // Fall back to env var if version.json is missing or R2 is unreachable
  const latestVersion = versions[plugin] ?? process.env.AXIOM_BLOCKS_PRO_VERSION ?? "1.0.0";
  const noUpdate = compareVersions(clientVersion, latestVersion) >= 0;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://wpaxiom.com";
  const downloadUrl = new URL("/api/plugins/download", appUrl);
  downloadUrl.searchParams.set("license_key", licenseKey);
  downloadUrl.searchParams.set("site_url", siteUrl);
  downloadUrl.searchParams.set("plugin", plugin);

  return NextResponse.json({
    id: `${plugin}/${plugin}.php`,
    slug: plugin,
    plugin: `${plugin}/${plugin}.php`,
    new_version: latestVersion,
    url: meta.url,
    package: noUpdate ? "" : downloadUrl.toString(),
    requires: meta.requires,
    tested: meta.tested,
    requires_php: meta.requires_php,
    no_update: noUpdate,
  });
}
