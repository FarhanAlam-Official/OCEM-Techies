import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define role-based homepages
const roleHomepages = {
  admin: "/admin",
  core_team: "/dashboard",
  member: "/dashboard",
}

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/auth/login",
  "/auth/register",
  "/auth/otp-login",
  "/auth/callback",
  "/resources",
  "/events",
]

// Define auth routes that should redirect to homepage if authenticated
const publicAuthRoutes = ["/auth/login", "/auth/register", "/auth/reset-password"]

// Define protected routes and their required roles
const protectedRoutes = {
  "/admin": ["admin"],
  "/dashboard": ["admin", "core_team", "member"],
  "/core": ["admin", "core_team"],
}

// Helper function to verify session with retries
async function verifySessionWithRetries(supabase: any, userId: string, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.id === userId) {
      return session
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  return null
}

const PUBLIC_ROUTES = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
]

const isPublicRoute = (path: string) => {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route))
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const requestPath = new URL(req.url).pathname

    // Allow public routes
    if (isPublicRoute(requestPath)) {
      // Redirect to dashboard if user is already logged in and trying to access auth pages
      if (session && requestPath.startsWith("/auth/")) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return res
    }

    // Protected routes
    if (!session) {
      // Save the original URL the user was trying to access
      const redirectUrl = new URL("/auth/login", req.url)
      redirectUrl.searchParams.set("redirectTo", requestPath)
      return NextResponse.redirect(redirectUrl)
    }

    // Role-based access control
    if (requestPath.startsWith("/admin")) {
      const userRole = session.user.user_metadata.role
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return res
  } catch (e) {
    // If there's an error, redirect to sign in
    console.error("Auth middleware error:", e)
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't require authentication
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/public).*)",
  ],
}
