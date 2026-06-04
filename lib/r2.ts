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

// Maps product_name (lowercase, trimmed) → R2 object key.
// Add new pro plugins here as the catalog grows.
export const PRODUCT_R2_KEYS: Record<string, string> = {
  "axiom blocks pro": "axiom-blocks-pro.zip",
};

// Maps plugin slug → R2 object key (used by update-check / download routes).
export const PLUGIN_R2_KEYS: Record<string, string> = {
  "axiom-blocks-pro": "axiom-blocks-pro.zip",
};

export function productNameToR2Key(productName: string): string | null {
  return PRODUCT_R2_KEYS[productName.toLowerCase().trim()] ?? null;
}

/**
 * Read version.json from R2 and return its contents.
 *
 * version.json shape: { "axiom-blocks-pro": "1.1.0", ... }
 *
 * Upload a new version.json alongside the zip whenever you release —
 * no env var changes or redeploys needed.
 */
export async function getPluginVersions(): Promise<Record<string, string>> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CF_R2_BUCKET_NAME!,
      Key: "version.json",
    });
    const response = await r2Client.send(command);
    const text = await response.Body?.transformToString("utf-8");
    if (!text) return {};
    return JSON.parse(text) as Record<string, string>;
  } catch {
    return {};
  }
}
