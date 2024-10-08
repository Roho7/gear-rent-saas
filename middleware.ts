import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "./app/_utils/supabase";
import { fetchUser } from "./app/account/_actions/user.actions";

// Define an array of protected routes
const protectedRoutes = ["/business", "/account"]; // Add more routes as needed
const adminRoutes = ["/admin"]; // Routes that require admin access

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const pathname = request.nextUrl.pathname;

    // Check if the current path starts with any of the protected routes
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute || isAdminRoute) {
      if (!session?.expires_in) {
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
