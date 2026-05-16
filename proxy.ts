import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/forgot-password", "/change-password"];

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  const session = request.cookies.get("auth_token")?.value;
  let isAuthenticated = false;

  if (session) {
    try {
      await jwtVerify(session, getSecret());
      isAuthenticated = true;
    } catch {
      // Expired or tampered — treat as logged out
    }
  }

  if (!isAuthenticated && !isPublicPath) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("auth_token", "", { httpOnly: true, maxAge: 0, path: "/" });
    return response;
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
