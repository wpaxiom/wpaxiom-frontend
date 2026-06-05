import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ?? "https://api.wpaxiom.com/wp-json";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type WPJWTResponse = {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
};

async function authenticateAgainstWordPress(
  email: string,
  password: string
): Promise<WPJWTResponse | null> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; wpaxiom-frontend/1.0)",
      },
      body: JSON.stringify({ username: email, password }),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`[auth] WP JWT ${res.status}: ${body.slice(0, 200)}`);
      return null;
    }
    return (await res.json()) as WPJWTResponse;
  } catch (error) {
    console.warn("[auth] WP JWT fetch failed:", error);
    return null;
  }
}

function decodeWpTokenExp(token: string): number | null {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(Buffer.from(b64, "base64").toString()) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const wp = await authenticateAgainstWordPress(email, password);
        if (!wp) return null;

        return {
          id: wp.user_email,
          email: wp.user_email,
          name: wp.user_display_name,
          nicename: wp.user_nicename,
          wpToken: wp.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.wpToken = user.wpToken;
        token.nicename = user.nicename;
        token.wpTokenExp = user.wpToken ? decodeWpTokenExp(user.wpToken) ?? undefined : undefined;
        token.error = undefined;
      }
      // WP JWT expired — flag it so the account layout can redirect to login
      if (token.wpTokenExp && Math.floor(Date.now() / 1000) > token.wpTokenExp) {
        token.error = "WPTokenExpired";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.wpToken = token.wpToken;
        session.user.nicename = token.nicename;
      }
      if (token.error) session.error = token.error;
      return session;
    },
  },
});
