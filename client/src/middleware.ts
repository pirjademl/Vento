import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(pathname);
  const token = null;

  // 1. Get token from Cookies (instead of localStorage)
  //const token = req.cookies.set("access_token");
  //onsole.log(token);
  //  const token = req.cookies.get("access_token")?.value;

  // 2. Logic for Login page
  if (pathname === "/login") {
    if (token) {
      // If user has a token, try to validate or just redirect to dashboard
      return NextResponse.redirect(new URL("/rooms", req.url));
    }
    return NextResponse.next();
  }

  // 3. Logic for Protected Routes
  //  if (!token) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  //}

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
