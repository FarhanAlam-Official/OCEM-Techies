import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        // Get the user's session
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          // Get the user's role from the profile
          const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (profile?.role) {
            // Determine the redirect path based on role
            const roleHomepages = {
              admin: "/admin",
              core_team: "/dashboard",
              member: "/dashboard",
            }

            // If next is not the default "/", use it, otherwise use role-based homepage
            const redirectTo = next !== "/" ? next : (roleHomepages[profile.role as keyof typeof roleHomepages] || "/dashboard")
            
            // Add a success parameter to show a welcome message
            const redirectUrl = new URL(redirectTo, request.url)
            redirectUrl.searchParams.set("verified", "true")
            
            return NextResponse.redirect(redirectUrl)
          }
        }
      }

      // If there's an error or no session, redirect to login with error
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("error", "verification_failed")
      return NextResponse.redirect(loginUrl)
    } catch (error) {
      console.error("Error in auth callback:", error)
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("error", "verification_failed")
      return NextResponse.redirect(loginUrl)
    }
  }

  // If there's no code, redirect to login
  return NextResponse.redirect(new URL("/auth/login", request.url))
} 