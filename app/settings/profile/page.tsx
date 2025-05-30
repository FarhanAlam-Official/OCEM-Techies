"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { ProfileForm } from "@/components/auth/profile-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container max-w-2xl py-6 lg:py-10">
        <div className="space-y-6">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return null
  }

  return (
    <div className="container max-w-2xl py-6 lg:py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and profile information.
          </p>
        </div>
        <ProfileForm user={userProfile} />
      </div>
    </div>
  )
} 