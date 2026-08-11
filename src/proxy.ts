import { NextResponse } from "next/server";
import { auth } from "@/auth";

const publicPrefixes = ["/login", "/registro"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;

  const isPublic = publicPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/inicio", req.nextUrl));
  }

  if (!isLoggedIn && !isPublic) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/inicio", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};