import { type NextRequest, NextResponse } from "next/server";
import { fetchUser } from "./app/(public)/account/_actions/user.actions";
import { createMiddlewareClient } from "./app/_utils/supabase";

// Define an array of protected routes
const protectedRoutes = ["/inventory", "/account"]; // Add more routes as needed
const adminRoutes = ["/admin"]; // Routes that require admin access

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    // Check if the current path starts with any of the protected routes
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute || isAdminRoute) {
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (isAdminRoute) {
        const gearyoUser = await fetchUser();
        if (!gearyoUser?.is_admin) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    ...protectedRoutes.map((route) => `${route}/:path*`),
    ...adminRoutes.map((route) => `${route}/:path*`),
  ],
};
