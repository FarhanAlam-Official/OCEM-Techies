"use client"

import React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/context/auth-context"
import type { SignInCredentials } from "@/lib/types/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isOTPMode, setIsOTPMode] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const validateForm = () => {
    if (!email) {
      setError("Email is required")
      return false
    }
    if (!isOTPMode && !password) {
      setError("Password is required")
      return false
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)

    try {
      if (isOTPMode) {
        // Send OTP
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: "login" }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to send OTP")
        }

        router.push(`/auth/otp-login?email=${encodeURIComponent(email)}`)
      } else {
        const credentials: SignInCredentials = { email, password }
        const { data, error } = await signIn(credentials)

        if (error) {
          setError(error.message)
          return
        }

        if (!data?.user) {
          setError("Failed to sign in. Please try again.")
          return
        }

        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email)
        } else {
          localStorage.removeItem('rememberedEmail')
        }

        // Get the redirect path from URL or default to home page
        const redirectPath = searchParams.get("redirect")
        const targetPath = redirectPath || "/"

        toast({
          title: "Login Successful",
          description: "Welcome back! You've been logged in successfully.",
          duration: 3000,
        })

        // Use window.location.href for a full page reload to ensure clean state
        window.location.href = targetPath
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-50 to-white px-4 py-12">
        <div className="w-full max-w-[450px] space-y-6">
          {/* Logo and Title */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-2 text-white">
              <Code className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">OCEM Techies</h1>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="pl-10 border-gray-200 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {!isOTPMode && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          className="pl-10 border-gray-200 focus:border-purple-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={loading}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                  {!isOTPMode && (
                    <Link
                      href="/auth/forgot-password"
                      className={`text-sm text-purple-600 hover:text-purple-700 hover:underline ${
                        loading ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-purple-600 hover:text-purple-700"
                    onClick={() => setIsOTPMode(!isOTPMode)}
                    disabled={loading}
                  >
                    {isOTPMode ? "Use password instead" : "Use OTP instead"}
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isOTPMode ? "Sending OTP..." : "Signing in..."}
                    </>
                  ) : (
                    isOTPMode ? "Send OTP" : "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className={`text-purple-600 hover:text-purple-700 font-medium hover:underline ${
                      loading ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Back Link */}
          <div className="text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">OCEM Techies</span>
              </div>
              <p className="text-gray-400">Together We Build, Together We Grow</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors block">
                  Home
                </Link>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors block">
                  About Us
                </Link>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors block">
                  Events
                </Link>
                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors block">
                  Blog
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <div className="space-y-2 text-sm">
                <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors block">
                  Join Club
                </Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors block">
                  Contact Us
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors block">
                  FAQ
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors block">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors block">
                  Privacy Policy
                </Link>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors block">
                  Help & Support
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} OCEM Techies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
