import type { AuthError } from "@/lib/types/auth"

export const AUTH_ERROR_MESSAGES = {
  // Supabase auth errors
  "Invalid login credentials": "Invalid email or password",
  "Email not confirmed": "Please verify your email address before signing in",
  "User already registered": "An account with this email already exists",
  "Password is too weak": "Password must be at least 8 characters long and contain at least one number and one special character",
  "Email link is invalid or has expired": "The email link has expired. Please request a new one",
  
  // Custom errors
  "NO_USER_PROFILE": "User profile not found. Please contact support",
  "INVALID_ROLE": "Invalid user role",
  "PROFILE_CREATE_FAILED": "Failed to create user profile",
  "SESSION_EXPIRED": "Your session has expired. Please sign in again",
} as const

export type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES

export function getAuthErrorMessage(error: AuthError): string {
  if (!error) return "An unknown error occurred"

  // Check if the error message is in our predefined messages
  const predefinedMessage = AUTH_ERROR_MESSAGES[error.message as AuthErrorCode]
  if (predefinedMessage) return predefinedMessage

  // If not found in predefined messages, return the original error message
  // or a generic error message if none exists
  return error.message || "An unexpected error occurred"
}

export function isAuthError(error: any): error is AuthError {
  return (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  )
} 