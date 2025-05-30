import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import type { SignInCredentials, SignUpData } from "@/lib/types/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

interface AuthFormState {
  loading: boolean
  error: string | null
}

export function useAuthForm() {
  const [state, setState] = useState<AuthFormState>({
    loading: false,
    error: null,
  })
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSignIn = async (credentials: SignInCredentials) => {
    setState({ loading: true, error: null })

    try {
      const { error } = await signIn(credentials)

      if (error) {
        setState({ loading: false, error: error.message })
        toast.error(error.message)
        return
      }

      // Get the redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get("redirectTo") || "/dashboard"
      toast.success("Successfully signed in!")
      router.push(redirectTo)
    } catch (error) {
      setState({
        loading: false,
        error: "An unexpected error occurred. Please try again.",
      })
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  const handleSignUp = async (data: SignUpData) => {
    setState({ loading: true, error: null })

    try {
      const { error } = await signUp(data)

      if (error) {
        setState({ loading: false, error: error.message })
        toast.error(error.message)
        return
      }

      toast.success(
        "Registration successful! Please check your email to verify your account."
      )
      router.push("/auth/verify-email")
    } catch (error) {
      setState({
        loading: false,
        error: "An unexpected error occurred. Please try again.",
      })
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  return {
    ...state,
    handleSignIn,
    handleSignUp,
  }
} 