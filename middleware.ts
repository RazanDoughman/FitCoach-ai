export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/workouts/:path*", "/progress/:path*"],
}


export function middleware() {
  return;
}
