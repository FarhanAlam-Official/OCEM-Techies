"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for hash error parameters (from email links)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        if (hashParams.has("error")) {
          const errorCode = hashParams.get("error_code")
          const errorDescription = hashParams.get("error_description")
          
          if (errorCode === "otp_expired") {
            setError("The email verification link has expired. Please request a new one.")
          } else {
            setError(errorDescription || "An error occurred during authentication.")
          }
          return
        }

        const code = searchParams.get("code")
        const next = searchParams.get("next") || "/dashboard"

        if (code) {
          // First check if we already have a session
          const { data: { session: existingSession } } = await supabase.auth.getSession()
          
          if (existingSession) {
            // User is already logged in, redirect to dashboard
            router.push(next)
            return
          }

          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error("Error exchanging code for session:", error)
            setError("Failed to verify your email. Please try again.")
            return
          }

          // Get the new session
          const { data: { session } } = await supabase.auth.getSession()

          if (session) {
            toast({
              title: "Email Verified",
              description: "Your email has been verified successfully. Welcome to OCEM Techies!",
              duration: 5000,
            })
            router.push(next)
          } else {
            setError("Failed to create session. Please try logging in.")
          }
        } else if (!error) {
          // No code and no error means we shouldn't be here
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Error in auth callback:", error)
        setError("An unexpected error occurred. Please try again.")
      }
    }

    handleCallback()
  }, [router, searchParams, supabase.auth, toast])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                OCEM Techies
              </span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Error</CardTitle>
              <CardDescription>There was a problem with your authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button variant="default" className="w-full" asChild>
                  <Link href="/auth/resend-verification">Request New Verification Link</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/login">Return to Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-lg font-medium text-gray-900">Verifying your email...</p>
            <p className="text-sm text-gray-600">Please wait while we complete the process.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 