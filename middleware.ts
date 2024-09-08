import { updateSession } from "@/packages/supabase/utils/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "./app/_actions/user.actions";

export async function middleware(request: NextRequest) {
  console.log("Middleware called for path:", request.nextUrl.pathname);

  const response = await updateSession(request);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("Admin route detected");

    try {
      const user = await getUser();
      console.log("User data:", user);

      if (!user) {
        console.log("No user found, redirecting");
        return NextResponse.redirect(new URL("/", request.url));
      }

      console.log("Is admin?", user.is_admin);

      if (!user.is_admin) {
        console.log("User is not an admin, redirecting");
        return NextResponse.redirect(new URL("/", request.url));
      }

      console.log("User is an admin, proceeding");
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
