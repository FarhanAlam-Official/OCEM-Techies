"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { supabase } from "@/lib/supabase"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, CheckCheck, Trash2, Calendar, Mail, Users, AlertCircle, Info, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  title: string
  message: string
  type: "event" | "announcement" | "reminder" | "system" | "welcome"
  is_read: boolean
  action_url?: string
  created_at: string
}

export default function NotificationsPage() {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAsRead, setMarkingAsRead] = useState<string[]>([])

  useEffect(() => {
    if (userProfile) {
      fetchNotifications()
    }
  }, [userProfile])

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userProfile?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    setMarkingAsRead((prev) => [...prev, notificationId])
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", userProfile?.id)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    } finally {
      setMarkingAsRead((prev) => prev.filter((id) => id !== notificationId))
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

      if (unreadIds.length === 0) return

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", unreadIds)
        .eq("user_id", userProfile?.id)

      if (error) throw error

      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))

      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Error marking all as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", userProfile?.id)

      if (error) throw error

      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))

      toast({
        title: "Success",
        description: "Notification deleted",
      })
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="w-5 h-5 text-blue-600" />
      case "announcement":
        return <Bell className="w-5 h-5 text-purple-600" />
      case "reminder":
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case "system":
        return <Info className="w-5 h-5 text-gray-600" />
      case "welcome":
        return <Users className="w-5 h-5 text-green-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-blue-100 text-blue-800"
      case "announcement":
        return "bg-purple-100 text-purple-800"
      case "reminder":
        return "bg-orange-100 text-orange-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      case "welcome":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="mr-3 h-8 w-8" />
              Notifications
              {unreadCount > 0 && <Badge className="ml-3 bg-red-100 text-red-800">{unreadCount} unread</Badge>}
            </h1>
            <p className="text-gray-600">Stay updated with the latest news and events</p>
          </div>

          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} className="flex items-center">
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Your latest updates and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                          notification.is_read ? "bg-gray-50" : "bg-blue-50 border-l-4 border-blue-500"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h3
                                className={`text-sm font-medium ${
                                  notification.is_read ? "text-gray-900" : "text-gray-900 font-semibold"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <Badge
                                className={`text-xs ${getNotificationBadgeColor(notification.type)}`}
                              >
                                {notification.type}
                              </Badge>
                              {!notification.is_read && <Badge className="bg-blue-600 text-white text-xs">New</Badge>}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </span>
                              {!notification.is_read && (
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  disabled={markingAsRead.includes(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {markingAsRead.includes(notification.id) ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className={`text-sm ${notification.is_read ? "text-gray-600" : "text-gray-700"}`}>
                            {notification.message}
                          </p>
                          {notification.action_url && (
                            <Button className="p-0 h-auto mt-2 text-purple-600">
                              View Details →
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Manage your notification preferences in your{" "}
              <Button className="p-0 h-auto text-purple-600">
                profile settings
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">
                    {userProfile?.notification_preferences?.email ?? "Disabled"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Bell className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">In-App Notifications</h4>
                  <p className="text-sm text-gray-600">
                    {userProfile?.notification_preferences?.in_app ?? "Disabled"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
