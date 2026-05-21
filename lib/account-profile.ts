import { createHash } from "crypto";
import { auth } from "./auth";

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

export type ProfileData = {
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  website: string;
  avatarUrl: string;
  phone: string;
  company: string;
  billing: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
};

function gravatarUrl(email: string): string {
  const hash = createHash("md5").update(email.toLowerCase().trim()).digest("hex");
  return `https://secure.gravatar.com/avatar/${hash}?s=160&d=mp`;
}

type WPUserMe = {
  name: string;
  url: string;
  first_name: string;
  last_name: string;
  avatar_urls: Record<string, string>;
};

type WCCustomerFull = {
  billing: {
    company: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
};

async function fetchWPMe(wpToken: string): Promise<WPUserMe | null> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp/v2/users/me?context=edit`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${wpToken}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as WPUserMe;
  } catch {
    return null;
  }
}

async function fetchWCCustomer(email: string): Promise<WCCustomerFull | null> {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) return null;
  const basicAuth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64");
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/wc/v3/customers?email=${encodeURIComponent(email)}&per_page=1`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const list = (await res.json()) as WCCustomerFull[];
    return list[0] ?? null;
  } catch {
    return null;
  }
}

export async function getProfileForCurrentUser(): Promise<ProfileData | null> {
  const session = await auth();
  const email = session?.user?.email;
  const wpToken = session?.user?.wpToken;
  if (!email) return null;

  const [wpMe, wcCustomer] = await Promise.all([
    wpToken ? fetchWPMe(wpToken) : null,
    fetchWCCustomer(email),
  ]);

  // Prefer WP's own avatar URL (Gravatar or plugin override), fall back to computed Gravatar
  const avatarUrl =
    wpMe?.avatar_urls?.["96"] ??
    wpMe?.avatar_urls?.["48"] ??
    gravatarUrl(email);

  return {
    displayName: wpMe?.name ?? session?.user?.name ?? "",
    firstName: wpMe?.first_name ?? "",
    lastName: wpMe?.last_name ?? "",
    email,
    website: wpMe?.url ?? "",
    avatarUrl,
    phone: wcCustomer?.billing?.phone ?? "",
    company: wcCustomer?.billing?.company ?? "",
    billing: {
      address1: wcCustomer?.billing?.address_1 ?? "",
      address2: wcCustomer?.billing?.address_2 ?? "",
      city: wcCustomer?.billing?.city ?? "",
      state: wcCustomer?.billing?.state ?? "",
      postcode: wcCustomer?.billing?.postcode ?? "",
      country: wcCustomer?.billing?.country ?? "",
    },
  };
}
