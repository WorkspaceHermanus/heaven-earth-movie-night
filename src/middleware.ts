import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

/**
 * Cheap gate that bounces anonymous visitors away from /admin before the page
 * renders. The signature is verified properly in the page and API handlers —
 * middleware runs on the Edge runtime, which has no Node crypto, so this only
 * checks that a cookie is present.
 */
export function middleware(request: NextRequest) {
  const hasCookie = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!hasCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
