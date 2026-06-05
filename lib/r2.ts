import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedDownloadUrl(
  objectKey: string,
  expiresInSeconds = 900
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.CF_R2_BUCKET_NAME!,
    Key: objectKey,
  });
  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

// Maps WC product_name (lowercase, trimmed) → R2 object key.
// NOTE: the paid product in this store is named "Axiom Blocks" (a variable
// subscription) and it delivers the "axiom-blocks-pro" plugin zip. Both name
// variants are mapped so a rename of the display name doesn't break downloads.
// Add new pro plugins here as the catalog grows.
export const PRODUCT_R2_KEYS: Record<string, string> = {
  "axiom blocks": "axiom-blocks-pro.zip",
  "axiom blocks pro": "axiom-blocks-pro.zip",
};

// Maps plugin slug → R2 object key (used by update-check / download routes).
export const PLUGIN_R2_KEYS: Record<string, string> = {
  "axiom-blocks-pro": "axiom-blocks-pro.zip",
};

export function productNameToR2Key(productName: string): string | null {
  return PRODUCT_R2_KEYS[productName.toLowerCase().trim()] ?? null;
}

// "axiom-blocks-pro.zip" → "axiom-blocks-pro" (the slug used by the
// authenticated /api/account/download route).
export function r2KeyToPluginSlug(r2Key: string): string {
  return r2Key.replace(/\.zip$/i, "");
}

export type PluginMeta = { version: string; name: string };

function slugToName(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/**
 * Read version.json from R2.
 *
 * Supports both formats — upgrade when ready:
 *   Old: { "axiom-blocks-pro": "1.1.0" }
 *   New: { "axiom-blocks-pro": { "version": "1.1.0", "name": "Axiom Blocks Pro" } }
 */
export async function getPluginVersions(): Promise<Record<string, PluginMeta>> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CF_R2_BUCKET_NAME!,
      Key: "version.json",
    });
    const response = await r2Client.send(command);
    const text = await response.Body?.transformToString("utf-8");
    if (!text) return {};
    const raw = JSON.parse(text) as Record<string, string | PluginMeta>;
    const result: Record<string, PluginMeta> = {};
    for (const [slug, value] of Object.entries(raw)) {
      result[slug] =
        typeof value === "string"
          ? { version: value, name: slugToName(slug) }
          : value;
    }
    return result;
  } catch {
    return {};
  }
}
