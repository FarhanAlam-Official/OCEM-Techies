"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/context/auth-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Home,
  Calendar,
  BookOpen,
  Users,
  LogOut,
  Menu,
  Code,
  Bell,
  User,
  Shield,
  BarChart3,
  Mail,
  PlusCircle,
  Globe,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { userProfile, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "core_team", "member"],
    },
    {
      name: "Events",
      href: "/dashboard/events",
      icon: Calendar,
      roles: ["admin", "core_team", "member"],
    },
    {
      name: "Blog",
      href: "/dashboard/blog",
      icon: BookOpen,
      roles: ["admin", "core_team", "member"],
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["admin", "core_team", "member"],
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      roles: ["admin", "core_team", "member"],
    },
  ]

  const mainSiteNavigation = [
    {
      name: "Main Website",
      href: "/",
      icon: Globe,
    },
    {
      name: "Public Events",
      href: "/events",
      icon: Calendar,
    },
    {
      name: "Public Blog",
      href: "/resources",
      icon: BookOpen,
    },
  ]

  const adminNavigation = [
    {
      name: "Admin Panel",
      href: "/admin",
      icon: Shield,
      roles: ["admin"],
    },
    {
      name: "Manage Users",
      href: "/admin/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Manage Events",
      href: "/admin/events",
      icon: Calendar,
      roles: ["admin"],
    },
    {
      name: "Manage Blog",
      href: "/admin/blog",
      icon: BookOpen,
      roles: ["admin"],
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      roles: ["admin"],
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: Mail,
      roles: ["admin"],
    },
  ]

  const coreTeamNavigation = [
    {
      name: "Create Event",
      href: "/core/events/create",
      icon: PlusCircle,
      roles: ["core_team", "admin"],
    },
    {
      name: "Create Post",
      href: "/core/blog/create",
      icon: PlusCircle,
      roles: ["core_team", "admin"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(userProfile?.role || "member"))

  const filteredAdminNavigation = adminNavigation.filter((item) => item.roles.includes(userProfile?.role || "member"))

  const filteredCoreTeamNavigation = coreTeamNavigation.filter((item) =>
    item.roles.includes(userProfile?.role || "member"),
  )

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            OCEM Techies
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
            <div className="space-y-1">
              {filteredNavigation.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", pathname === item.href && "bg-purple-100 text-purple-900")}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Site Navigation */}
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Main Site</h2>
            <div className="space-y-1">
              {mainSiteNavigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {filteredCoreTeamNavigation.length > 0 && (
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Core Team</h2>
              <div className="space-y-1">
                {filteredCoreTeamNavigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", pathname === item.href && "bg-blue-100 text-blue-900")}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {filteredAdminNavigation.length > 0 && (
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Administration</h2>
              <div className="space-y-1">
                {filteredAdminNavigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", pathname === item.href && "bg-red-100 text-red-900")}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {userProfile?.first_name?.[0]}
              {userProfile?.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {userProfile?.first_name} {userProfile?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{userProfile?.role?.replace("_", " ")}</p>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0", className)}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4 z-40" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
