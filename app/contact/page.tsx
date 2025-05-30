"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Code,
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  MessageSquare,
  Users,
  Calendar,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/layout/header"

interface ContactForm {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const subjects = [
    "General Inquiry",
    "Event Information",
    "Membership Question",
    "Partnership Opportunity",
    "Technical Support",
    "Feedback",
    "Other",
  ]

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Save to database
      const { error } = await supabase.from("contact_messages").insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      ])

      if (error) throw error

      // TODO: Send email via Brevo API
      // This would be implemented in a server action or API route

      setSubmitted(true)
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <Header />

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-coral-100 text-coral-700 hover:bg-coral-200">💬 Get in Touch</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Let's Connect and
              </span>
              <br />
              <span className="text-gray-900">Build Together</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Have questions about OCEM Techies? Want to collaborate on a project? Looking to join our community? We'd
              love to hear from you and help you get started on your tech journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Thank you for your message! We've received your inquiry and will respond within 24 hours.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select value={formData.subject} onValueChange={(value:any) => handleInputChange("subject", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-purple-600" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">OCEM Campus</h4>
                    <p className="text-gray-600 text-sm">
                      Computer Science Department
                      <br />
                      Building A, Room 201
                      <br />
                      OCEM University
                      <br />
                      City, State 12345
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
                  </div>
                </CardContent>
              </Card>

              {/* Email & Phone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-blue-600" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">General Inquiries</p>
                    <p className="text-sm text-gray-600">info@ocemtechies.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Events</p>
                    <p className="text-sm text-gray-600">events@ocemtechies.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Support</p>
                    <p className="text-sm text-gray-600">support@ocemtechies.com</p>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-coral-600" />
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-sm font-medium">Main Office</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <CardDescription>Stay connected with our community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button className="hover:bg-purple-50">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button className="hover:bg-blue-50">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button className="hover:bg-blue-50">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common things you might be looking for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/auth/register">
                      <Users className="mr-2 h-4 w-4" />
                      Join OCEM Techies
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/events">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Upcoming Events
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/about">
                      <Users className="mr-2 h-4 w-4" />
                      Learn About Us
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about OCEM Techies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I join OCEM Techies?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Simply click the "Join Club" button and create your account. Membership is free for all OCEM students
                  and open to anyone interested in technology.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are events free for members?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Most of our events are completely free for members. Some special workshops or conferences may have a
                  small fee to cover materials and refreshments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I propose an event or workshop?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We encourage members to share their expertise. Contact us with your proposal and we'll help you
                  organize and promote your event.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer mentorship programs?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! We connect students with industry professionals and senior members for guidance on projects,
                  career advice, and skill development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">OCEM Techies</span>
              </div>
              <p className="text-gray-400">Together We Build, Together We Grow</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors block">
                  Home
                </Link>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors block">
                  About Us
                </Link>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors block">
                  Events
                </Link>
                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors block">
                  Blog
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <div className="space-y-2 text-sm">
                <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors block">
                  Join Club
                </Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors block">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>info@ocemtechies.com</p>
                <p>+1 (555) 123-4567</p>
                <p>OCEM Campus, Building A</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} OCEM Techies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
