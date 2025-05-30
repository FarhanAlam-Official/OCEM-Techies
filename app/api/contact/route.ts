import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { brevoService } from "@/lib/brevo"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Store contact submission
    const { error } = await supabase.from("contact_submissions").insert([
      {
        name,
        email,
        subject,
        message,
        status: "new",
      },
    ])

    if (error) throw error

    // Send notification email to admin
    await brevoService.sendContactFormNotification(name, email, subject, message)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
