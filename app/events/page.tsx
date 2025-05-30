"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { badgeVariants } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Search, Filter, Code, Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Header } from "@/components/layout/header"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  end_date?: string
  venue: string
  category: string
  capacity: number
  image_url?: string
  registration_deadline: string
  registered_count: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("upcoming")

  const categories = ["Workshop", "Tech Talk", "Hackathon", "Networking", "Training", "Seminar"]

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, categoryFilter, timeFilter])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          description,
          event_date,
          end_date,
          venue,
          category,
          capacity,
          image_url,
          registration_deadline,
          event_registrations(count)
        `)
        .eq("is_active", true)
        .order("event_date", { ascending: true })

      if (error) throw error

      const eventsWithCount = (data || []).map((event:any) => ({
        ...event,
        registered_count: event.event_registrations?.[0]?.count || 0,
      }))

      setEvents(eventsWithCount)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event: Event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event: Event) => event.category === categoryFilter)
    }

    // Filter by time
    const now = new Date()
    if (timeFilter === "upcoming") {
      filtered = filtered.filter((event: Event) => new Date(event.event_date) >= now)
    } else if (timeFilter === "past") {
      filtered = filtered.filter((event: Event) => new Date(event.event_date) < now)
    }

    setFilteredEvents(filtered)
  }

  const isRegistrationOpen = (event: Event): boolean => {
    const now = new Date()
    const deadline = new Date(event.registration_deadline)
    const eventDate = new Date(event.event_date)

    return now < deadline && now < eventDate && event.registered_count < event.capacity
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className={cn(badgeVariants({ variant: "default" }), "bg-coral-100 text-coral-700 hover:bg-coral-200")}>
              🎯 Upcoming Events
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Learn, Build, and
              </span>
              <br />
              <span className="text-gray-900">Connect with Tech</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join our exciting events designed to enhance your technical skills, expand your network, and accelerate
              your career in technology. From hands-on workshops to inspiring tech talks.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter Events
              </CardTitle>
              <CardDescription>Find the perfect events for your interests and schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Events</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by title, description, or venue..."
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
                  <label className="text-sm font-medium">Time Period</label>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="upcoming">Upcoming Events</SelectItem>
                      <SelectItem value="past">Past Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <Image
                      src={event.image_url || "/placeholder.svg?height=200&width=400"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={cn(badgeVariants({ variant: "default" }), "bg-white/90 text-gray-800")}>
                        {event.category}
                      </div>
                    </div>
                    {!isRegistrationOpen(event) && (
                      <div className="absolute top-4 right-4">
                        <div className={cn(badgeVariants({ variant: "destructive" }), "bg-white/90 text-gray-800")}>
                          {event.registered_count >= event.capacity ? "Full" : "Closed"}
                        </div>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
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
                        {event.end_date && (
                          <>
                            {" - "}
                            {new Date(event.end_date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.venue}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={`/events/${event.id}`}
                        className={cn(buttonVariants(), "w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700")}
                      >
                        View Details
                      </Link>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/events/${event.id}/register`}
                          className={cn(buttonVariants(), "flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700")}
                        >
                          Register Now
                        </Link>
                      </div>
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">Don't Miss Out on Future Events</h2>
            <p className="text-xl opacity-90">
              Join OCEM Techies to get notified about upcoming events, workshops, and exclusive opportunities.
            </p>
            <Button className="h-11 rounded-md px-8 bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="/auth/register">
                <Users className="w-5 h-5 mr-2" />
                Join Our Community
              </Link>
            </Button>
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
              <h4 className="font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className={cn(buttonVariants({ variant: "outline" }), "hover:bg-purple-50")}>
                  <Github className="w-4 h-4" />
                </Link>
                <Link href="#" className={cn(buttonVariants({ variant: "outline" }), "hover:bg-blue-50")}>
                  <Linkedin className="w-4 h-4" />
                </Link>
                <Link href="#" className={cn(buttonVariants({ variant: "outline" }), "hover:bg-blue-50")}>
                  <Twitter className="w-4 h-4" />
                </Link>
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
