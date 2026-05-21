import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuthed = Boolean(req.auth);
  const path = req.nextUrl.pathname;
  const isAccountRoute = path.startsWith("/account");

  if (isAccountRoute && !isAuthed) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  // Run on /account/* only. Auth.js's own /api/auth/* routes are excluded
  // automatically by the matcher.
  matcher: ["/account/:path*"],
};
