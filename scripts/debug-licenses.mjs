// Run from project root:
//   node scripts/debug-licenses.mjs
//
// Prints WC customers, LMFWC licenses, and recent orders so we can see
// exactly what's stored on the WP backend and where the link breaks.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadEnv() {
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

const env = loadEnv();
const base = env.WORDPRESS_API_URL || "https://api.wpaxiom.com/wp-json";

if (!env.WC_CONSUMER_KEY || !env.WC_CONSUMER_SECRET) {
  console.error("Missing WC_CONSUMER_KEY / WC_CONSUMER_SECRET in .env.local");
  process.exit(1);
}
if (!env.LMFWC_CONSUMER_KEY || !env.LMFWC_CONSUMER_SECRET) {
  console.error("Missing LMFWC_CONSUMER_KEY / LMFWC_CONSUMER_SECRET in .env.local");
  process.exit(1);
}

const wcAuth = `Basic ${Buffer.from(
  `${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`
).toString("base64")}`;
const lmAuth = `Basic ${Buffer.from(
  `${env.LMFWC_CONSUMER_KEY}:${env.LMFWC_CONSUMER_SECRET}`
).toString("base64")}`;

const HEADERS_BASE = {
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent": "Mozilla/5.0 (compatible; wpaxiom-frontend/1.0)",
};

async function fetchJson(url, auth) {
  const res = await fetch(url, { headers: { ...HEADERS_BASE, Authorization: auth } });
  const ct = res.headers.get("content-type") || "";
  const body = await res.text();
  if (!ct.includes("application/json")) {
    return { status: res.status, json: null, raw: body };
  }
  try {
    return { status: res.status, json: JSON.parse(body), raw: null };
  } catch {
    return { status: res.status, json: null, raw: body };
  }
}

console.log(`base URL: ${base}\n`);

// 1. WC customers
{
  const { status, json, raw } = await fetchJson(
    `${base}/wc/v3/customers?per_page=20&orderby=registered_date&order=desc`,
    wcAuth
  );
  console.log(`=== WC customers (status ${status}) ===`);
  if (Array.isArray(json) && json.length > 0) {
    for (const c of json) {
      console.log(
        `  id=${c.id}  email=${c.email}  name="${c.first_name} ${c.last_name}"  username=${c.username}`
      );
    }
  } else if (Array.isArray(json)) {
    console.log("  (no customers)");
  } else {
    console.log("  ERROR:", raw?.slice(0, 200) ?? json);
  }
}

// 2. LMFWC licenses
console.log("");
{
  const { status, json, raw } = await fetchJson(`${base}/lmfwc/v2/licenses`, lmAuth);
  console.log(`=== LMFWC licenses (status ${status}) ===`);
  if (status === 404 && raw && raw.includes("lmfwc_rest_data_error")) {
    console.log("  (no license keys in LMFWC at all — generator not firing on order)");
  } else if (json && json.success && Array.isArray(json.data)) {
    for (const l of json.data) {
      console.log(
        `  id=${l.id}  key=${l.licenseKey ? l.licenseKey.slice(0, 8) + "…" : "(hidden)"}  orderId=${l.orderId}  productId=${l.productId}  userId=${l.userId}  status=${l.status}  activations=${l.timesActivated}/${l.timesActivatedMax}  expires=${l.expiresAt}`
      );
    }
  } else {
    console.log("  ERROR:", raw?.slice(0, 200) ?? JSON.stringify(json).slice(0, 200));
  }
}

// 3. Recent WC orders
console.log("");
{
  const { status, json, raw } = await fetchJson(
    `${base}/wc/v3/orders?per_page=10&orderby=date&order=desc`,
    wcAuth
  );
  console.log(`=== Recent WC orders (status ${status}) ===`);
  if (Array.isArray(json) && json.length > 0) {
    for (const o of json) {
      const lineItems = (o.line_items ?? [])
        .map((li) => `${li.name}#${li.variation_id || li.product_id}`)
        .join(", ");
      console.log(
        `  id=${o.id}  status=${o.status}  customer_id=${o.customer_id}  email=${o.billing?.email}  total=${o.total}  items=[${lineItems}]`
      );
    }
  } else if (Array.isArray(json)) {
    console.log("  (no orders)");
  } else {
    console.log("  ERROR:", raw?.slice(0, 200) ?? json);
  }
}

console.log("\n--- check this ---");
console.log("1. Did a license appear above? If not → LMFWC isn't firing on order completion (config issue)");
console.log("2. Does license.userId == order.customer_id == one of the WC customers above? If not → license is linked to a different user");
console.log("3. Is your Next.js login email in the WC customers list? You only see licenses where userId matches the customer matching your login email");
