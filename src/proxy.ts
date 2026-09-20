import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route yang membutuhkan login
const PROTECTED_ROUTES = [
  "/dashboard",
  "/community",
  "/risk-analysis",
  "/evacuation-assistant",
];

// Route yang hanya bisa diakses jika BELUM login (redirect ke dashboard jika sudah)
const AUTH_ROUTES = ["/login", "/register", "/auth"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek token JWT dari cookie atau header
  const token =
    request.cookies.get("auth_token")?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  const isLoggedIn = Boolean(token);

  // Proteksi route private — redirect ke /login jika belum login
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cegah akses halaman auth jika sudah login — redirect ke dashboard
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match semua routes kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     * - api routes (dihandle sendiri)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|api/).*)",
  ],
};
