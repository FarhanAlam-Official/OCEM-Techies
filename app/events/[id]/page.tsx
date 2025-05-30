"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  MapPin,
  Code,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface EventDetails {
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
  created_by: string
  created_at: string
  creator: {
    first_name: string
    last_name: string
    profile_image_url?: string
  }
  registered_count: number
  is_registered: boolean
  attendees: Array<{
    id: string
    first_name: string
    last_name: string
    profile_image_url?: string
    faculty?: string
  }>
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const { toast } = useToast()
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchEventDetails()
    }
  }, [params.id, user])

  const fetchEventDetails = async () => {
    try {
      // Fetch event details with creator info
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select(`
          *,
          creator:users!created_by(first_name, last_name, profile_image_url),
          event_registrations(count)
        `)
        .eq("id", params.id)
        .eq("is_active", true)
        .single()

      if (eventError) throw eventError

      // Check if current user is registered
      let isRegistered = false
      if (user) {
        const { data: registrationData } = await supabase
          .from("event_registrations")
          .select("id")
          .eq("event_id", params.id)
          .eq("user_id", user.id)
          .single()

        isRegistered = !!registrationData
      }

      // Fetch attendees
      const { data: attendeesData } = await supabase
        .from("event_registrations")
        .select(`
          user:users(id, first_name, last_name, profile_image_url, faculty)
        `)
        .eq("event_id", params.id)
        .limit(10)

      const attendees = attendeesData?.map((reg) => reg.user).filter(Boolean) || []

      setEvent({
        ...eventData,
        registered_count: eventData.event_registrations?.[0]?.count || 0,
        is_registered: isRegistered,
        attendees,
      })
    } catch (error) {
      console.error("Error fetching event details:", error)
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setRegistering(true)
    try {
      const { error } = await supabase.from("event_registrations").insert([
        {
          event_id: event?.id,
          user_id: user.id,
        },
      ])

      if (error) throw error

      // Create notification
      await supabase.from("notifications").insert([
        {
          user_id: user.id,
          title: "Event Registration Confirmed",
          message: `You have successfully registered for "${event?.title}". We'll send you a reminder before the event.`,
          type: "event",
          action_url: `/events/${event?.id}`,
        },
      ])

      toast({
        title: "Registration Successful!",
        description: "You have been registered for this event. Check your notifications for confirmation.",
      })

      // Refresh event details
      fetchEventDetails()
    } catch (error) {
      console.error("Error registering for event:", error)
      toast({
        title: "Registration Failed",
        description: "Unable to register for this event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRegistering(false)
    }
  }

  const handleUnregister = async () => {
    if (!user) return

    setRegistering(true)
    try {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", event?.id)
        .eq("user_id", user.id)

      if (error) throw error

      toast({
        title: "Unregistered Successfully",
        description: "You have been unregistered from this event.",
      })

      // Refresh event details
      fetchEventDetails()
    } catch (error) {
      console.error("Error unregistering from event:", error)
      toast({
        title: "Error",
        description: "Unable to unregister from this event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRegistering(false)
    }
  }

  const isRegistrationOpen = () => {
    if (!event) return false
    const now = new Date()
    const deadline = new Date(event.registration_deadline)
    const eventDate = new Date(event.event_date)

    return now < deadline && now < eventDate && event.registered_count < event.capacity
  }

  const getEventStatus = () => {
    if (!event) return null
    const now = new Date()
    const eventDate = new Date(event.event_date)
    const deadline = new Date(event.registration_deadline)

    if (eventDate < now) return "past"
    if (deadline < now) return "closed"
    if (event.registered_count >= event.capacity) return "full"
    return "open"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const status = getEventStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
            <Link href="/events" className="text-sm font-medium text-purple-600">
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
            {user ? (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  asChild
                >
                  <Link href="/auth/register">Join Club</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="container mx-auto px-4 lg:px-6 pt-6">
        <Button variant="ghost" asChild>
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Event Details */}
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative">
              <Image
                src={event.image_url || "/placeholder.svg?height=400&width=800"}
                alt={event.title}
                width={800}
                height={400}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {event.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                {event.is_registered && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Registered
                  </Badge>
                )}
                {status === "full" && <Badge variant="destructive">Full</Badge>}
                {status === "closed" && <Badge variant="destructive">Registration Closed</Badge>}
                {status === "past" && <Badge variant="secondary">Past Event</Badge>}
              </div>
            </div>

            {/* Event Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl lg:text-3xl">{event.title}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
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
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.venue}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Event Creator */}
            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={event.creator.profile_image_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {event.creator.first_name[0]}
                      {event.creator.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">
                      {event.creator.first_name} {event.creator.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">Event Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Registration</CardTitle>
                <CardDescription>
                  {event.registered_count}/{event.capacity} spots filled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                  ></div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Registration Deadline:</span>
                    <span className="font-medium">{new Date(event.registration_deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-medium">{event.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Spots:</span>
                    <span className="font-medium">{event.capacity - event.registered_count}</span>
                  </div>
                </div>

                <Separator />

                {!user ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>You need to be logged in to register for events.</AlertDescription>
                  </Alert>
                ) : null}

                {status === "open" && !event.is_registered && (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleRegister}
                    disabled={registering || !user}
                  >
                    {registering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register for Event"
                    )}
                  </Button>
                )}

                {event.is_registered && (
                  <div className="space-y-2">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>You are registered for this event!</AlertDescription>
                    </Alert>
                    <Button variant="outline" className="w-full" onClick={handleUnregister} disabled={registering}>
                      {registering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Unregistering...
                        </>
                      ) : (
                        "Unregister"
                      )}
                    </Button>
                  </div>
                )}

                {status === "full" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>This event is full. Registration is no longer available.</AlertDescription>
                  </Alert>
                )}

                {status === "closed" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Registration for this event has closed.</AlertDescription>
                  </Alert>
                )}

                {status === "past" && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>This event has already taken place.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Attendees */}
            {event.attendees.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attendees ({event.registered_count})</CardTitle>
                  <CardDescription>People who will be attending this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={attendee.profile_image_url || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {attendee.first_name[0]}
                            {attendee.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {attendee.first_name} {attendee.last_name}
                          </p>
                          {attendee.faculty && <p className="text-xs text-gray-500 truncate">{attendee.faculty}</p>}
                        </div>
                      </div>
                    ))}
                    {event.registered_count > event.attendees.length && (
                      <p className="text-xs text-gray-500 text-center">
                        +{event.registered_count - event.attendees.length} more attendees
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
