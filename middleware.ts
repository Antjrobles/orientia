import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((token as { deviceVerified?: boolean })?.deviceVerified === false) {
    return NextResponse.redirect(
      new URL("/login?error=DeviceVerificationRequired", req.url),
    );
  }

  if (pathname.startsWith("/admin")) {
    if ((token as { role?: string })?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/alumnos/:path*",
    "/informes/:path*",
    "/centros/:path*",
    "/admin/:path*",
  ],
};
