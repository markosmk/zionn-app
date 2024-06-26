import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { NextAuthRequest } from "next-auth/lib"
import { authConfig } from "@/lib/auth/auth.config"

export const config = {
  matcher: [
    "/me/:path*",
    "/create",
    "/login",
    "/register",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

const authRoutes = ["/login", "/register"]
const protectedRoutes = ["/me", "/create"]

export default NextAuth(authConfig).auth((req: NextAuthRequest) => {
  const isAuthPage = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (req.auth && isAuthPage) {
    return NextResponse.redirect(new URL("/me", req.url))
  }

  if (!req.auth && isProtected) {
    const absoluteUrl = new URL("/login", req.nextUrl.origin)
    return NextResponse.redirect(absoluteUrl.toString())
  }

  return NextResponse.next()
})
