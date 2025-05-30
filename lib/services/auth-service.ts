import { supabase } from "../supabase"
import type {
  AuthResponse,
  SignInCredentials,
  SignUpData,
  UserProfile,
} from "../types/auth"

class AuthService {
  private static instance: AuthService
  
  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signIn({ email, password }: SignInCredentials): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        return { data: null, error: authError }
      }

      if (!authData.user) {
        return {
          data: null,
          error: { message: "Failed to sign in" },
        }
      }

      const profile = await this.fetchUserProfile(authData.user.id)

      if (!profile.data) {
        await supabase.auth.signOut()
        return {
          data: null,
          error: { message: "User profile not found. Please contact support." },
        }
      }

      // Update user metadata with profile data
      await this.updateUserMetadata(profile.data)

      return {
        data: {
          ...authData,
          user: {
            ...authData.user,
            user_metadata: {
              ...authData.user.user_metadata,
              role: profile.data.role,
              first_name: profile.data.first_name,
              last_name: profile.data.last_name,
            },
          },
        },
        error: null,
      }
    } catch (error) {
      console.error("Unexpected error in signIn:", error)
      await supabase.auth.signOut()
      return {
        data: null,
        error: { message: "An unexpected error occurred during sign in" },
      }
    }
  }

  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            student_id: userData.student_id || null,
            faculty: userData.faculty || null,
            year_of_study: userData.year_of_study || null,
            phone: userData.phone || null,
          },
        },
      })

      if (authError) {
        console.error("Error creating auth user:", authError)
        return { data: null, error: authError }
      }

      if (!authData.user) {
        console.error("No user data returned from auth signup")
        return {
          data: null,
          error: { message: "Failed to create user" },
        }
      }

      console.log("Auth user created successfully:", authData.user.id)

      // Create the user profile
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          student_id: userData.student_id || null,
          faculty: userData.faculty || null,
          year_of_study: userData.year_of_study || null,
          phone: userData.phone || null,
          role: "member",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (profileError) {
        console.error("Error creating user profile:", profileError)
        // If profile creation fails, delete the auth user
        await this.deleteUser(authData.user.id)
        return {
          data: null,
          error: { message: "Failed to create user profile. Please try again." },
        }
      }

      // Return success response
      return {
        data: {
          ...authData,
          user: {
            ...authData.user,
            user_metadata: {
              ...authData.user.user_metadata,
              role: "member",
              first_name: userData.first_name,
              last_name: userData.last_name,
            },
          },
        },
        error: null,
      }
    } catch (error) {
      console.error("Error in signUp:", error)
      return {
        data: null,
        error: { message: "An unexpected error occurred during sign up" },
      }
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  async fetchUserProfile(userId: string): Promise<AuthResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return {
        data: null,
        error: { message: "Failed to fetch user profile" },
      }
    }
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<AuthResponse<UserProfile>> {
    try {
      const { data: updatedData, error } = await supabase
        .from("users")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        return { data: null, error }
      }

      await this.updateUserMetadata(updatedData)
      return { data: updatedData, error: null }
    } catch (error) {
      console.error("Error updating profile:", error)
      return {
        data: null,
        error: { message: "Failed to update profile" },
      }
    }
  }

  private async updateUserMetadata(profile: UserProfile): Promise<void> {
    try {
      await supabase.auth.updateUser({
        data: {
          role: profile.role,
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
      })
    } catch (error) {
      console.error("Error updating user metadata:", error)
    }
  }

  private async deleteUser(userId: string): Promise<void> {
    try {
      await supabase.auth.admin.deleteUser(userId)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }
}

export const authService = AuthService.getInstance() 