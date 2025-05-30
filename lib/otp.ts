import { createServerSupabaseClient } from "./supabase"

export class OTPService {
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  static async storeOTP(email: string, otp: string, type: "login" | "register" | "reset" = "login") {
    const supabase = createServerSupabaseClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const { error } = await supabase.from("otp_codes").upsert({
      email,
      code: otp,
      type,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (error) throw error
  }

  static async verifyOTP(email: string, otp: string, type: "login" | "register" | "reset" = "login"): Promise<boolean> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", email)
      .eq("code", otp)
      .eq("type", type)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) return false

    // Mark OTP as used
    await supabase.from("otp_codes").update({ used: true }).eq("id", data.id)

    return true
  }

  static async cleanupExpiredOTPs() {
    const supabase = createServerSupabaseClient()

    await supabase.from("otp_codes").delete().lt("expires_at", new Date().toISOString())
  }
}
