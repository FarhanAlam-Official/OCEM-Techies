const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_API_URL = "https://api.brevo.com/v3"

interface EmailData {
  to: Array<{ email: string; name?: string }>
  subject: string
  htmlContent: string
  textContent?: string
  templateId?: number
  params?: Record<string, any>
}

export class BrevoService {
  private apiKey: string

  constructor() {
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not configured")
    }
    this.apiKey = BREVO_API_KEY
  }

  private async makeRequest(endpoint: string, data: any) {
    const response = await fetch(`${BREVO_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Brevo API error: ${error}`)
    }

    return response.json()
  }

  async sendTransactionalEmail(emailData: EmailData) {
    return this.makeRequest("/smtp/email", {
      sender: { email: "noreply@ocemtechies.com", name: "OCEM Techies" },
      ...emailData,
    })
  }

  async sendOTP(email: string, otp: string, name?: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">OCEM Techies</h1>
          <p style="color: #6b7280; margin: 5px 0;">Your verification code</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <h2 style="color: white; margin: 0 0 10px 0;">Verification Code</h2>
          <div style="background: white; padding: 15px; border-radius: 8px; display: inline-block; margin: 10px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">This code expires in 10 minutes</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
    `

    return this.sendTransactionalEmail({
      to: [{ email, name }],
      subject: "Your OCEM Techies Verification Code",
      htmlContent,
      textContent: `Your OCEM Techies verification code is: ${otp}. This code expires in 10 minutes.`,
    })
  }

  async sendEventRegistrationConfirmation(
    email: string,
    name: string,
    eventTitle: string,
    eventDate: string,
    venue: string,
  ) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">OCEM Techies</h1>
          <p style="color: #6b7280; margin: 5px 0;">Event Registration Confirmed</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${name}!</h2>
          <p style="color: #4b5563; margin: 0 0 20px 0;">
            You have successfully registered for the following event:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed;">
            <h3 style="color: #7c3aed; margin: 0 0 10px 0;">${eventTitle}</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Date:</strong> ${eventDate}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Venue:</strong> ${venue}</p>
          </div>
          
          <p style="color: #4b5563; margin: 20px 0 0 0;">
            We'll send you a reminder 24 hours before the event. See you there!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px;">
            Questions? Reply to this email or contact us at info@ocemtechies.com
          </p>
        </div>
      </div>
    `

    return this.sendTransactionalEmail({
      to: [{ email, name }],
      subject: `Registration Confirmed: ${eventTitle}`,
      htmlContent,
      textContent: `Hi ${name}, you have successfully registered for ${eventTitle} on ${eventDate} at ${venue}. We'll send you a reminder before the event.`,
    })
  }

  async sendEventReminder(email: string, name: string, eventTitle: string, eventDate: string, venue: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">OCEM Techies</h1>
          <p style="color: #6b7280; margin: 5px 0;">Event Reminder</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px; margin: 20px 0;">
          <h2 style="color: #92400e; margin: 0 0 20px 0;">⏰ Event Tomorrow!</h2>
          <p style="color: #92400e; margin: 0 0 20px 0;">
            Hi ${name}, this is a friendly reminder that you're registered for:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #7c3aed; margin: 0 0 10px 0;">${eventTitle}</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Date:</strong> ${eventDate}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Venue:</strong> ${venue}</p>
          </div>
          
          <p style="color: #92400e; margin: 20px 0 0 0;">
            Don't forget to bring your student ID and arrive 15 minutes early!
          </p>
        </div>
      </div>
    `

    return this.sendTransactionalEmail({
      to: [{ email, name }],
      subject: `Reminder: ${eventTitle} is Tomorrow!`,
      htmlContent,
      textContent: `Hi ${name}, this is a reminder that you're registered for ${eventTitle} tomorrow at ${venue}. Don't forget to bring your student ID!`,
    })
  }

  async sendMembershipConfirmation(email: string, name: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">OCEM Techies</h1>
          <p style="color: #6b7280; margin: 5px 0;">Welcome to the Community!</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <h2 style="color: white; margin: 0 0 20px 0;">🎉 Welcome ${name}!</h2>
          <p style="color: white; margin: 0 0 20px 0;">
            Your membership application has been approved. You're now part of the OCEM Techies community!
          </p>
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: white; margin: 0; font-weight: bold;">
              Login to your dashboard to explore events, resources, and connect with fellow techies.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://ocemtechies.com/dashboard" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Dashboard
          </a>
        </div>
      </div>
    `

    return this.sendTransactionalEmail({
      to: [{ email, name }],
      subject: "Welcome to OCEM Techies! 🎉",
      htmlContent,
      textContent: `Welcome ${name}! Your membership application has been approved. You're now part of the OCEM Techies community. Login to your dashboard at https://ocemtechies.com/dashboard`,
    })
  }

  async sendContactFormNotification(name: string, email: string, subject: string, message: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 10px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>
    `

    return this.sendTransactionalEmail({
      to: [{ email: "admin@ocemtechies.com", name: "OCEM Techies Admin" }],
      subject: `Contact Form: ${subject}`,
      htmlContent,
      textContent: `New contact form submission from ${name} (${email}): ${message}`,
    })
  }
}

export const brevoService = new BrevoService()
