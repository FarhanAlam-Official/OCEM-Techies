"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Upload, Loader2, CheckCircle, Users, Lightbulb, Palette, Camera } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  studentId: string
  faculty: string
  yearOfStudy: string
  interests: string
  preferredRoles: string[]
  motivation: string
  experience: string
  portfolioUrl: string
}

export default function JoinPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    faculty: "",
    yearOfStudy: "",
    interests: "",
    preferredRoles: [],
    motivation: "",
    experience: "",
    portfolioUrl: "",
  })
  const [resume, setResume] = useState<File | null>(null)

  const faculties = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Business Administration",
    "Other",
  ]

  const roles = [
    { id: "tech", label: "Technical Development", icon: Code, description: "Web/Mobile development, AI/ML, Backend" },
    { id: "design", label: "UI/UX Design", icon: Palette, description: "User interface design, user experience" },
    { id: "media", label: "Media & Content", icon: Camera, description: "Photography, videography, content creation" },
    { id: "management", label: "Project Management", icon: Users, description: "Event planning, team coordination" },
    {
      id: "research",
      label: "Research & Innovation",
      icon: Lightbulb,
      description: "Tech research, innovation projects",
    },
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRoleToggle = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredRoles: prev.preferredRoles.includes(roleId)
        ? prev.preferredRoles.filter((id) => id !== roleId)
        : [...prev.preferredRoles, roleId],
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }
      setResume(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value))
        } else {
          submitData.append(key, String(value))
        }
      })

      // Add resume file if present
      if (resume) {
        submitData.append("resume", resume)
      }

      const response = await fetch("/api/membership", {
        method: "POST",
        body: submitData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application")
      }

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      })

      router.push("/")
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              OCEM Techies
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link href="/events" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Events
            </Link>
            <Link href="/resources" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button className="hover:bg-transparent h-9 rounded-md px-3" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join OCEM Techies</h1>
            <p className="text-xl text-gray-600 mb-8">
              Become part of our innovative tech community and shape the future of technology
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Hands-on Projects
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Industry Mentorship
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Networking Events
              </div>
            </div>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Application</CardTitle>
              <CardDescription>Tell us about yourself and why you want to join our tech community</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange("studentId", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty *</Label>
                      <Select onValueChange={(value: string) => handleInputChange("faculty", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {faculties.map((faculty) => (
                            <SelectItem key={faculty} value={faculty}>
                              {faculty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">Year of Study *</Label>
                      <Select onValueChange={(value: string) => handleInputChange("yearOfStudy", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Interests and Roles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Areas of Interest</h3>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Technical Interests *</Label>
                    <Textarea
                      id="interests"
                      placeholder="Tell us about your technical interests (e.g., web development, AI/ML, mobile apps, cybersecurity, etc.)"
                      value={formData.interests}
                      onChange={(e) => handleInputChange("interests", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Preferred Roles (Select all that apply) *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.preferredRoles.includes(role.id)
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleRoleToggle(role.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={formData.preferredRoles.includes(role.id)}
                              onChange={() => handleRoleToggle(role.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <role.icon className="w-5 h-5 text-purple-600" />
                                <h4 className="font-medium text-gray-900">{role.label}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Motivation and Experience */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tell Us More</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="motivation">Why do you want to join OCEM Techies? *</Label>
                      <Textarea
                        id="motivation"
                        placeholder="Share your motivation for joining our tech community and what you hope to achieve..."
                        value={formData.motivation}
                        onChange={(e) => handleInputChange("motivation", e.target.value)}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Previous Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about any relevant projects, internships, or technical experience you have..."
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolioUrl">Portfolio/GitHub URL</Label>
                      <Input
                        id="portfolioUrl"
                        type="url"
                        placeholder="https://github.com/yourusername or your portfolio website"
                        value={formData.portfolioUrl}
                        onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume/CV (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="resume" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="text-sm text-gray-600">
                          {resume ? (
                            <p className="font-medium text-green-600">{resume.name}</p>
                          ) : (
                            <>
                              <p className="font-medium">Click to upload your resume</p>
                              <p>PDF, DOC, or DOCX (max 5MB)</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      By submitting this application, you agree to our terms and conditions. We'll review your
                      application and contact you within 5-7 business days.
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button type="button" className="border border-input bg-background hover:bg-accent hover:text-accent-foreground" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={loading || formData.preferredRoles.length === 0}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Application Review</h4>
                <p className="text-sm text-gray-600">Our team reviews your application and background</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Interview Process</h4>
                <p className="text-sm text-gray-600">Brief interview to get to know you better</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Welcome Aboard</h4>
                <p className="text-sm text-gray-600">Join our community and start your tech journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
