import { type NextRequest, NextResponse } from "next/server"
import { OTPService } from "@/lib/otp"
import { brevoService } from "@/lib/brevo"

export async function POST(request: NextRequest) {
  try {
    const { email, type = "login" } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate and store OTP
    const otp = OTPService.generateOTP()
    await OTPService.storeOTP(email, otp, type)

    // Send OTP via Brevo
    await brevoService.sendOTP(email, otp)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
