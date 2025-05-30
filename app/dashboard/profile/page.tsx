"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, GraduationCap, Building, Calendar, Bell, Shield, Camera, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileFormData {
  first_name: string
  last_name: string
  student_id: string
  faculty: string
  year_of_study: number | null
  phone: string
  bio: string
  notification_preferences: {
    email: boolean
    in_app: boolean
    event_reminders: boolean
    newsletter: boolean
  }
}

export default function ProfilePage() {
  const { userProfile, updateProfile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    student_id: "",
    faculty: "",
    year_of_study: null,
    phone: "",
    bio: "",
    notification_preferences: {
      email: true,
      in_app: true,
      event_reminders: true,
      newsletter: false,
    },
  })

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

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        student_id: userProfile.student_id || "",
        faculty: userProfile.faculty || "",
        year_of_study: userProfile.year_of_study || null,
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
        notification_preferences: userProfile.notification_preferences || {
          email: true,
          in_app: true,
          event_reminders: true,
          newsletter: false,
        },
      })
    }
  }, [userProfile])

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [field]: value,
      },
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !userProfile) return

    setImageUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${userProfile.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(filePath)

      await updateProfile({ profile_image_url: publicUrl })

      toast({
        title: "Success",
        description: "Profile image updated successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(formData)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "core_team":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3 h-3" />
      case "core_team":
        return <GraduationCap className="w-3 h-3" />
      default:
        return <User className="w-3 h-3" />
    }
  }

  if (!userProfile) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1 bg-gradient-to-b from-white to-gray-50">
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>Your current profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={userProfile?.profile_image_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {userProfile?.first_name?.[0]}
                      {userProfile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {imageUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-gray-600" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </h3>
                  <p className="text-gray-600">{userProfile?.email}</p>
                  <Badge className={`mt-2 ${getRoleColor(userProfile?.role || "member")}`}>
                    {getRoleIcon(userProfile?.role || "member")}
                    <span className="ml-1 capitalize">{userProfile?.role?.replace("_", " ")}</span>
                  </Badge>
                </div>
              </div>

              <Separator className="bg-gray-200" />

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-gray-600">Student ID</span>
                    <p className="font-medium">{userProfile?.student_id || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-gray-600">Faculty</span>
                    <p className="font-medium">{userProfile?.faculty || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-gray-600">Year</span>
                    <p className="font-medium">
                      {userProfile?.year_of_study ? `${userProfile.year_of_study} Year` : "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <span className="text-gray-600">Phone</span>
                    <p className="font-medium">{userProfile?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-200" />

              <div className="text-xs text-gray-500">
                <p>Member since: {new Date(userProfile?.created_at || "").toLocaleDateString()}</p>
                <p>Last updated: {new Date(userProfile?.updated_at || "").toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        required
                        className="border-gray-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        required
                        className="border-gray-200 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={formData.student_id}
                        onChange={(e) => handleInputChange("student_id", e.target.value)}
                        placeholder="Enter your student ID"
                        className="border-gray-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        className="border-gray-200 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty</Label>
                      <Select value={formData.faculty} onValueChange={(value) => handleInputChange("faculty", value)}>
                        <SelectTrigger className="border-gray-200 focus:border-purple-500">
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
                      <Label htmlFor="yearOfStudy">Year of Study</Label>
                      <Select
                        value={formData.year_of_study?.toString() || ""}
                        onValueChange={(value) =>
                          handleInputChange("year_of_study", value ? Number.parseInt(value) : null)
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-purple-500">
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">5th Year</SelectItem>
                          <SelectItem value="6">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="border-gray-200 focus:border-purple-500 resize-none"
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-purple-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive notifications from OCEM Techies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={formData.notification_preferences.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">In-App Notifications</Label>
                      <p className="text-sm text-gray-600">Show notifications in the dashboard</p>
                    </div>
                    <Switch
                      checked={formData.notification_preferences.in_app}
                      onCheckedChange={(checked) => handleNotificationChange("in_app", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Event Reminders</Label>
                      <p className="text-sm text-gray-600">Get reminded about upcoming events you're registered for</p>
                    </div>
                    <Switch
                      checked={formData.notification_preferences.event_reminders}
                      onCheckedChange={(checked) => handleNotificationChange("event_reminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Newsletter</Label>
                      <p className="text-sm text-gray-600">Receive our weekly newsletter with tech updates</p>
                    </div>
                    <Switch
                      checked={formData.notification_preferences.newsletter}
                      onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                    />
                  </div>
                </div>

                <Alert className="bg-purple-50 border-purple-100">
                  <Mail className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-700">
                    You can change these preferences at any time. Important account and security notifications will
                    always be sent regardless of your preferences.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-600" />
                  Account Security
                </CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Address</h4>
                    <p className="text-sm text-gray-600">{userProfile?.email}</p>
                  </div>
                  <Badge variant={userProfile?.email_verified ? "default" : "destructive"}>
                    {userProfile?.email_verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600">Last updated: Never</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" disabled className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
