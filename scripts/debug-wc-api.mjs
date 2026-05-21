// Run from the project root:
//   node scripts/debug-wc-api.mjs
//
// Tests the WC v3 REST API exactly the way the Next.js server will call it
// at request time, using credentials from .env.local. Independent of Next.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[m[1]] = val;
  }
  return env;
}

const env = loadEnvLocal();
const base = env.WORDPRESS_API_URL || "https://api.wpaxiom.com/wp-json";
const ck = env.WC_CONSUMER_KEY;
const cs = env.WC_CONSUMER_SECRET;
console.log(`base URL: ${base}`);
console.log(`ck set: ${ck ? "yes (" + ck.slice(0, 7) + "...)" : "NO"}`);
console.log(`cs set: ${cs ? "yes" : "NO"}`);

if (!ck || !cs) {
  console.error("\nMissing WC_CONSUMER_KEY or WC_CONSUMER_SECRET in .env.local");
  process.exit(1);
}

const auth = `Basic ${Buffer.from(`${ck}:${cs}`).toString("base64")}`;
const HEADERS = {
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (compatible; wpaxiom-frontend/1.0; +https://wpaxiom.com)",
  Authorization: auth,
};

async function probe(label, url) {
  console.log(`\n--- ${label} ---`);
  console.log(`GET ${url}`);
  try {
    const res = await fetch(url, { headers: HEADERS });
    console.log(`status: ${res.status} ${res.statusText}`);
    const ct = res.headers.get("content-type") || "";
    const body = await res.text();
    if (ct.includes("application/json")) {
      try {
        const data = JSON.parse(body);
        if (Array.isArray(data)) {
          console.log(`array length: ${data.length}`);
          if (data.length > 0) {
            const p = data[0];
            console.log(
              `  first: id=${p.id} name=${p.name ?? "—"} type=${p.type} price=${p.price} sale=${p.sale_price}`
            );
            if (p.attributes) {
              for (const a of p.attributes) {
                console.log(
                  `    attribute: ${a.name} → option=${a.option ?? a.options?.join(",") ?? "—"}`
                );
              }
            }
            if (p.variations) {
              console.log(`  variation ids: [${p.variations.join(",")}]`);
            }
          }
        } else {
          console.log(
            `id=${data.id} name=${data.name} type=${data.type} variations=${(data.variations || []).length}`
          );
        }
      } catch {
        console.log(`(not valid json) first 300 chars:\n${body.slice(0, 300)}`);
      }
    } else {
      console.log(`content-type: ${ct}`);
      console.log(`first 300 chars:\n${body.slice(0, 300)}`);
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
}

await probe("Product by slug", `${base}/wc/v3/products?slug=axiom-blocks`);
await probe("Product variations", `${base}/wc/v3/products/29/variations?per_page=100`);
