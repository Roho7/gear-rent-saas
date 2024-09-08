import { updateSession } from "@/packages/supabase/utils/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "./app/_actions/user.actions";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    try {
      const user = await getUser();

      if (!user) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (!user.is_admin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error getting user:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/admin/:path*",
  ],
};
