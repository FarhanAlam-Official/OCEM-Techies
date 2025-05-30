import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Calendar, Users, Code, Rocket, Mail, MapPin, Clock, ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Header } from "@/components/layout/header"

export default function HomePage() {
  const features = [
    {
      icon: <Code className="w-8 h-8 text-white" />,
      title: "Learn & Build",
      description: "Hands-on workshops, coding bootcamps, and project-based learning to develop real-world skills.",
      gradient: "from-purple-600 to-blue-600",
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Connect & Collaborate",
      description: "Network with like-minded peers, find project partners, and build lasting professional relationships.",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      icon: <Rocket className="w-8 h-8 text-white" />,
      title: "Grow & Succeed",
      description: "Career guidance, industry mentorship, and opportunities to showcase your work to potential employers.",
      gradient: "from-coral-500 to-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className={cn(badgeVariants({ variant: "default" }), "bg-coral-100 text-coral-700 hover:bg-coral-200")}>
                  🚀 Welcome to OCEM Techies
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Together We Build,
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-gray-50">Together We Grow</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  Join OCEM's premier student tech club where innovation meets collaboration. Build cutting-edge
                  projects, learn from industry experts, and grow your tech career alongside passionate developers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className={cn(buttonVariants({ size: "lg" }), "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700")}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Community
                </Link>
                <Link
                  href="/events"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  View All Events
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Events Hosted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-coral-600">25+</div>
                  <div className="text-sm text-gray-600">Projects Built</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl blur-3xl opacity-20"></div>
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="OCEM Techies Community"
                width={600}
                height={600}
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/50 dark:bg-slate-900/50">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Ready to Start Your Tech Journey?</h2>
            <p className="text-xl opacity-90 font-medium">
              Join our vibrant community of tech enthusiasts and take your first step towards a successful career in technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link href="/auth/register">
                  <Users className="w-5 h-5 mr-2" />
                  Join OCEM Techies
                </Link>
              </Button>
              <Button className="border-white text-white hover:bg-white hover:text-purple-600" variant="outline" asChild>
                <Link href="/about">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Learn More
                </Link>
              </Button>
            </div>
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
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors block">
                  About Us
                </Link>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors block">
                  Events
                </Link>
                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors block">
                  Resources
                </Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors block">
                  Contact
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover:text-purple-400">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-blue-400">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-blue-400">
                  <Twitter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Join Us</h4>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
                <Link href="/auth/register">
                  <Users className="w-4 h-4 mr-2" />
                  Register Now
                </Link>
              </Button>
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
