import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const membershipData = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      student_id: formData.get("studentId") as string,
      faculty: formData.get("faculty") as string,
      year_of_study: Number.parseInt(formData.get("yearOfStudy") as string),
      interests: formData.get("interests") as string,
      preferred_roles: JSON.parse(formData.get("preferredRoles") as string),
      motivation: formData.get("motivation") as string,
      experience: formData.get("experience") as string,
      portfolio_url: formData.get("portfolioUrl") as string,
      status: "pending",
    }

    const supabase = createServerSupabaseClient()

    // Handle file upload if present
    const file = formData.get("resume") as File
    let resumeUrl = null

    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${membershipData.student_id}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("membership-files")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("membership-files").getPublicUrl(fileName)

      resumeUrl = publicUrl
    }

    // Store membership application
    const { error } = await supabase.from("membership_applications").insert([
      {
        ...membershipData,
        resume_url: resumeUrl,
      },
    ])

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    })
  } catch (error) {
    console.error("Error processing membership application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
