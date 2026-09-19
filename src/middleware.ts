import { NextRequest, NextResponse } from "next/server";
import { verifyTokenWebCrypto, COOKIE_NAME } from "@/lib/token-verify";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run middleware for /admin and /api/admin paths
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Allow public access to auth API routes
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = await verifyTokenWebCrypto(token);

  // If visiting /admin/login
  if (pathname === "/admin/login") {
    // If already logged in, redirect to /admin dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Protected /admin/* UI routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protected /api/admin/* API routes
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to access the studio admin API." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
