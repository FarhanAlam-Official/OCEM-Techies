"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, BookOpen, Bell, ArrowRight, Clock, MapPin } from "lucide-react"
import Link from "next/link"

interface EventWithRegistrations {
  id: string
  title: string
  event_date: string
  venue: string
  category: string
  capacity: number
  event_registrations: { count: number }[]
}

interface DashboardStats {
  totalEvents: number
  registeredEvents: number
  totalMembers: number
  unreadNotifications: number
}

interface UpcomingEvent {
  id: string
  title: string
  event_date: string
  venue: string
  category: string
  registered_count: number
  capacity: number
  is_registered: boolean
}

export default function DashboardPage() {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    registeredEvents: 0,
    totalMembers: 0,
    unreadNotifications: 0,
  })
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userProfile) {
      fetchDashboardData()
    }
  }, [userProfile])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [eventsResult, membersResult, notificationsResult] = await Promise.all([
        supabase.from("events").select("id").eq("is_active", true),
        supabase.from("users").select("id").eq("is_active", true),
        supabase.from("notifications").select("id").eq("user_id", userProfile?.id).eq("is_read", false),
      ])

      // Fetch user's registered events
      const { data: registrations } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("user_id", userProfile?.id)

      // Fetch upcoming events with registration status
      const { data: events } = await supabase
        .from("events")
        .select(`
          id,
          title,
          event_date,
          venue,
          category,
          capacity,
          event_registrations(count)
        `)
        .eq("is_active", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3)

      // Check which events user is registered for
      const eventsWithRegistration = await Promise.all(
        (events || []).map(async (event: EventWithRegistrations) => {
          const { data: userRegistration } = await supabase
            .from("event_registrations")
            .select("id")
            .eq("event_id", event.id)
            .eq("user_id", userProfile?.id)
            .single()

          return {
            ...event,
            registered_count: event.event_registrations?.[0]?.count || 0,
            is_registered: !!userRegistration,
          }
        }),
      )

      setStats({
        totalEvents: eventsResult.data?.length || 0,
        registeredEvents: registrations?.length || 0,
        totalMembers: membersResult.data?.length || 0,
        unreadNotifications: notificationsResult.data?.length || 0,
      })

      setUpcomingEvents(eventsWithRegistration)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            {getGreeting()}, {userProfile?.first_name}! 👋
          </h1>
          <p className="text-purple-100">Welcome back to OCEM Techies. Here's what's happening in your community.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Active events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.registeredEvents}</div>
              <p className="text-xs text-muted-foreground">Registered events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Don't miss out on these exciting events</CardDescription>
              </div>
              <Button className="inline-flex items-center" asChild>
                <Link href="/dashboard/events">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className="bg-secondary text-secondary-foreground">{event.category}</Badge>
                        {event.is_registered && <Badge className="bg-green-100 text-green-800">Registered</Badge>}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(event.event_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.venue}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {event.registered_count}/{event.capacity}
                        </div>
                      </div>
                    </div>
                    <Button className={`h-9 rounded-md px-3 ${event.is_registered ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} asChild>
                      <Link href={`/dashboard/events/${event.id}`}>
                        {event.is_registered ? "View Details" : "Register"}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                <p className="text-gray-600">Check back later for new events and workshops.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Calendar className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Browse Events</CardTitle>
              <CardDescription>Discover and register for upcoming tech events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/dashboard/events">
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Read Blog</CardTitle>
              <CardDescription>Stay updated with latest tech articles and tutorials</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground" asChild>
                <Link href="/dashboard/blog">
                  Read Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Users className="h-8 w-8 text-coral-600 mb-2" />
              <CardTitle className="text-lg">Update Profile</CardTitle>
              <CardDescription>Keep your profile information up to date</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground" asChild>
                <Link href="/dashboard/profile">
                  Edit Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
