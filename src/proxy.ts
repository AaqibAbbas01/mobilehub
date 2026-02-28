import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // These admin paths are always public (no auth required)
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/setup")
  ) {
    return NextResponse.next();
  }

  // All other /admin paths require an active session
  if (!req.auth) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
