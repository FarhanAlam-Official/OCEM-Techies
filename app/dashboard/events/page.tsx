"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  venue: string
  category: string
  capacity: number
  registered_count: number
  is_registered: boolean
  registration_deadline: string
}

export default function EventsPage() {
  const { userProfile } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("upcoming")

  const categories = ["Workshop", "Tech Talk", "Hackathon", "Networking", "Training"]

  useEffect(() => {
    fetchEvents()
  }, [userProfile])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, categoryFilter, timeFilter])

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          description,
          event_date,
          venue,
          category,
          capacity,
          registration_deadline,
          event_registrations(count)
        `)
        .eq("is_active", true)
        .order("event_date", { ascending: true })

      if (error) throw error

      // Check registration status for each event
      const eventsWithRegistration = await Promise.all(
        (eventsData || []).map(async (event:any) => {
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

      setEvents(eventsWithRegistration)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter)
    }

    // Filter by time
    const now = new Date()
    if (timeFilter === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.event_date) >= now)
    } else if (timeFilter === "past") {
      filtered = filtered.filter((event) => new Date(event.event_date) < now)
    }

    setFilteredEvents(filtered)
  }

  const handleRegister = async (eventId: string) => {
    try {
      const { error } = await supabase.from("event_registrations").insert([
        {
          event_id: eventId,
          user_id: userProfile?.id,
        },
      ])

      if (error) throw error

      // Refresh events
      fetchEvents()
    } catch (error) {
      console.error("Error registering for event:", error)
    }
  }

  const handleUnregister = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userProfile?.id)

      if (error) throw error

      // Refresh events
      fetchEvents()
    } catch (error) {
      console.error("Error unregistering from event:", error)
    }
  }

  const isRegistrationOpen = (event: Event) => {
    const now = new Date()
    const deadline = new Date(event.registration_deadline)
    const eventDate = new Date(event.event_date)

    return now < deadline && now < eventDate && event.registered_count < event.capacity
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Discover and register for upcoming tech events and workshops</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{event.category}</Badge>
                    {event.is_registered && <Badge className="bg-green-100 text-green-800">Registered</Badge>}
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(event.event_date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.venue}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {event.registered_count}/{event.capacity} registered
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      <Link href={`/dashboard/events/${event.id}`}>View Details</Link>
                    </Button>

                    {event.is_registered ? (
                      <Button
                        onClick={() => handleUnregister(event.id)}
                        className="flex-1"
                      >
                        Unregister
                      </Button>
                    ) : isRegistrationOpen(event) ? (
                      <Button
                        onClick={() => handleRegister(event.id)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Register
                      </Button>
                    ) : (
                      <Button disabled className="flex-1">
                        {event.registered_count >= event.capacity ? "Full" : "Closed"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new events.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
