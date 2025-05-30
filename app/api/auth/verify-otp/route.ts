import { type NextRequest, NextResponse } from "next/server"
import { OTPService } from "@/lib/otp"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, type = "login" } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    // Verify OTP
    const isValid = await OTPService.verifyOTP(email, otp, type)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    // For login type, create a magic link session
    if (type === "login") {
      const supabase = createServerSupabaseClient()

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
        data,
      })
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
