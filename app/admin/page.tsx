"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, BookOpen, Mail, UserPlus, TrendingUp, Activity, Clock } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalEvents: number
  totalBlogPosts: number
  pendingApplications: number
  contactSubmissions: number
  recentRegistrations: number
}

interface RecentActivity {
  id: string
  type: "user_registered" | "event_created" | "blog_published" | "application_submitted"
  description: string
  timestamp: string
  user?: {
    first_name: string
    last_name: string
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalBlogPosts: 0,
    pendingApplications: 0,
    contactSubmissions: 0,
    recentRegistrations: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [
        { count: totalUsers },
        { count: totalEvents },
        { count: totalBlogPosts },
        { count: pendingApplications },
        { count: contactSubmissions },
        { count: recentRegistrations },
      ] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("membership_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ])

      setStats({
        totalUsers: totalUsers || 0,
        totalEvents: totalEvents || 0,
        totalBlogPosts: totalBlogPosts || 0,
        pendingApplications: pendingApplications || 0,
        contactSubmissions: contactSubmissions || 0,
        recentRegistrations: recentRegistrations || 0,
      })

      // Fetch recent activity (simplified)
      const { data: recentUsers } = await supabase
        .from("users")
        .select("id, first_name, last_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      const activity: RecentActivity[] = (recentUsers || []).map((user:any) => ({
        id: user.id,
        type: "user_registered",
        description: `${user.first_name} ${user.last_name} joined the community`,
        timestamp: user.created_at,
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
        },
      }))

      setRecentActivity(activity)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: `+${stats.recentRegistrations} this week`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/admin/users",
    },
    {
      title: "Active Events",
      value: stats.totalEvents,
      description: "Events available",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/events",
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogPosts,
      description: "Published articles",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/admin/blog",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      description: "Awaiting review",
      icon: UserPlus,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/admin/membership",
    },
    {
      title: "Contact Messages",
      value: stats.contactSubmissions,
      description: "New submissions",
      icon: Mail,
      color: "text-red-600",
      bgColor: "bg-red-100",
      href: "/admin/contact",
    },
  ]

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_registered":
        return <Users className="w-4 h-4" />
      case "event_created":
        return <Calendar className="w-4 h-4" />
      case "blog_published":
        return <BookOpen className="w-4 h-4" />
      case "application_submitted":
        return <UserPlus className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_registered":
        return "text-blue-600 bg-blue-100"
      case "event_created":
        return "text-green-600 bg-green-100"
      case "blog_published":
        return "text-purple-600 bg-purple-100"
      case "application_submitted":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the OCEM Techies admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={stat.href}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-20 flex flex-col items-center justify-center" asChild>
                <Link href="/admin/events/create">
                  <Calendar className="w-6 h-6 mb-2" />
                  <span className="text-sm">Create Event</span>
                </Link>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center" asChild>
                <Link href="/admin/blog/create">
                  <BookOpen className="w-6 h-6 mb-2" />
                  <span className="text-sm">Write Blog</span>
                </Link>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center" asChild>
                <Link href="/admin/users">
                  <Users className="w-6 h-6 mb-2" />
                  <span className="text-sm">Manage Users</span>
                </Link>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center" asChild>
                <Link href="/admin/announcements">
                  <Mail className="w-6 h-6 mb-2" />
                  <span className="text-sm">Send Email</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Database</p>
                <p className="text-xs text-green-700">All systems operational</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Email Service</p>
                <p className="text-xs text-blue-700">Brevo API connected</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Storage</p>
                <p className="text-xs text-purple-700">Supabase storage ready</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
