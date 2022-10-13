export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/coach/:path*", "/player/:path*", "/api/((?!auth/).*)"],
}
