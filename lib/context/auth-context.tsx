"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../supabase"
import { authService } from "../services/auth-service"
import type {
  AuthContextType,
  AuthResponse,
  SignInCredentials,
  SignUpData,
  UserProfile,
} from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const authInProgress = useRef(false)

  const handleAuthStateChange = async (event: string, session: any) => {
    if (authInProgress.current) {
      console.log("Skipping auth state change while auth operation is in progress")
      return
    }

    console.log("Auth state changed:", event, session?.user?.id)

    if (event === "SIGNED_OUT" || !session) {
      setUser(null)
      setUserProfile(null)
      // Clear any remaining session data
      window.localStorage.removeItem('supabase.auth.token')
      window.localStorage.removeItem('sb-refresh-token')
      window.localStorage.removeItem('sb-access-token')
      window.localStorage.removeItem('supabase.auth.expires_at')
      return
    }

    if (session?.user && !authInProgress.current) {
      try {
        const profile = await authService.fetchUserProfile(session.user.id)
        if (profile.data) {
          setUser(session.user)
          setUserProfile(profile.data)
        } else {
          // If no profile found, sign out completely
          await signOut()
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
        // On error, sign out to maintain a clean state
        await signOut()
      }
    }
  }

  const signIn = async (credentials: SignInCredentials): Promise<AuthResponse> => {
    try {
      authInProgress.current = true
      const response = await authService.signIn(credentials)

      if (response.data?.user) {
        // Wait for profile fetch before updating state
        const profile = await authService.fetchUserProfile(response.data.user.id)
        if (profile.data) {
          // Update states atomically
          setUser(response.data.user)
          setUserProfile(profile.data)
          // Update session metadata
          await supabase.auth.updateUser({
            data: {
              role: profile.data.role,
              first_name: profile.data.first_name,
              last_name: profile.data.last_name,
            }
          })
        } else {
          // If no profile, sign out and return error
          await authService.signOut()
          return {
            data: null,
            error: { message: "User profile not found. Please contact support." }
          }
        }
      }

      return response
    } catch (error) {
      console.error("Error in signIn:", error)
      return {
        data: null,
        error: { message: "An unexpected error occurred during sign in" }
      }
    } finally {
      authInProgress.current = false
    }
  }

  const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    try {
      authInProgress.current = true
      return await authService.signUp(data)
    } finally {
      authInProgress.current = false
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      authInProgress.current = true
      // Clear states first to prevent UI flicker
      setUser(null)
      setUserProfile(null)

      // Clear all supabase data and session
      await supabase.auth.signOut()
      
      // Clear all local storage items that might contain auth data
      window.localStorage.removeItem('supabase.auth.token')
      window.localStorage.removeItem('sb-refresh-token')
      window.localStorage.removeItem('sb-access-token')
      window.localStorage.removeItem('supabase.auth.expires_at')
      window.localStorage.removeItem('rememberedEmail')

      // Clear any session storage items
      window.sessionStorage.clear()

      // Force clear cookies by setting them to expire
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })

      // Force reload the page to clear any remaining state and redirect to login
      window.location.href = '/auth/login'
    } catch (error) {
      console.error("Error signing out:", error)
      // Even if there's an error, try to force a clean state
      window.location.href = '/auth/login'
    } finally {
      authInProgress.current = false
    }
  }

  const updateProfile = async (data: Partial<UserProfile>): Promise<AuthResponse<UserProfile>> => {
    if (!user) {
      return {
        data: null,
        error: { message: "No user logged in" },
      }
    }

    const response = await authService.updateProfile(user.id, data)
    if (response.data) {
      setUserProfile(response.data)
    }
    return response
  }

  const refreshProfile = async (): Promise<void> => {
    if (!user) return

    const profile = await authService.fetchUserProfile(user.id)
    if (profile.data) {
      setUserProfile(profile.data)
    }
  }

  useEffect(() => {
    let mounted = true
    authInProgress.current = true

    const initializeAuth = async () => {
      try {
        // First check if we have a valid session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          throw error
        }

        if (!session?.user) {
          // No valid session, clear any stale data
          setUser(null)
          setUserProfile(null)
          window.localStorage.removeItem('supabase.auth.token')
          window.localStorage.removeItem('sb-refresh-token')
          window.localStorage.removeItem('sb-access-token')
          window.localStorage.removeItem('supabase.auth.expires_at')
        } else if (mounted) {
          // Valid session, fetch profile
          const profile = await authService.fetchUserProfile(session.user.id)
          if (profile.data) {
            setUser(session.user)
            setUserProfile(profile.data)
          } else {
            // No profile found, sign out
            await signOut()
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // On error, clear everything to be safe
        setUser(null)
        setUserProfile(null)
        await signOut()
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
          authInProgress.current = false
        }
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    return () => {
      mounted = false
      subscription.unsubscribe()
      authInProgress.current = false
    }
  }, [])

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 