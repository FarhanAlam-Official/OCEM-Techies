import type { User } from "@supabase/supabase-js"

export type UserRole = "admin" | "core_team" | "member"

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  student_id?: string
  faculty?: string
  year_of_study?: number
  phone?: string
  role: UserRole
  profile_image_url?: string
  bio?: string
  notification_preferences?: {
    email?: boolean
    in_app?: boolean
  }
  created_at: string
  updated_at: string
}

export interface AuthError {
  message: string
  code?: string
  status?: number
}

export interface AuthResponse<T = any> {
  data: T | null
  error: AuthError | null
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpData extends SignInCredentials {
  first_name: string
  last_name: string
  student_id?: string
  faculty?: string
  year_of_study?: number
  phone?: string
}

export interface AuthState {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  initialized: boolean
}

export interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse>
  signUp: (data: SignUpData) => Promise<AuthResponse>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<AuthResponse<UserProfile>>
  refreshProfile: () => Promise<void>
} 