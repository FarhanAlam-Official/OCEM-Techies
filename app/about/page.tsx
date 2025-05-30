import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Users, Rocket, Target, Eye, Heart, Calendar, Award, Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "President",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Full-stack developer passionate about building scalable web applications and mentoring fellow students.",
      skills: ["React", "Node.js", "Python", "AWS"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Sarah Chen",
      role: "Vice President",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Frontend specialist with expertise in React and modern UI frameworks. Loves creating beautiful user experiences.",
      skills: ["React", "TypeScript", "Tailwind", "Figma"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Michael Rodriguez",
      role: "Technical Lead",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Backend engineer focused on cloud architecture and DevOps practices. Enjoys solving complex technical challenges.",
      skills: ["Django", "PostgreSQL", "Docker", "Kubernetes"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Emily Davis",
      role: "Events Coordinator",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Community builder dedicated to creating engaging tech experiences and fostering collaboration among members.",
      skills: ["Project Management", "Community Building", "Event Planning", "Marketing"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "David Kim",
      role: "Core Team Member",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Mobile app developer with a passion for creating innovative solutions that solve real-world problems.",
      skills: ["React Native", "Flutter", "Swift", "Kotlin"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Lisa Wang",
      role: "Core Team Member",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Data scientist and AI enthusiast working on machine learning projects and data visualization tools.",
      skills: ["Python", "TensorFlow", "R", "Tableau"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Club Founded",
      description: "OCEM Techies was established with 15 founding members passionate about technology and innovation.",
    },
    {
      year: "2021",
      title: "First Hackathon",
      description: "Organized our first 48-hour hackathon with 50+ participants and amazing innovative projects.",
    },
    {
      year: "2022",
      title: "Industry Partnerships",
      description: "Established partnerships with leading tech companies for internships and mentorship programs.",
    },
    {
      year: "2023",
      title: "500+ Members",
      description: "Reached a milestone of 500+ active members across different faculties and year levels.",
    },
    {
      year: "2024",
      title: "Innovation Lab",
      description: "Launched our dedicated innovation lab space for collaborative projects and workshops.",
    },
  ]

  const achievements = [
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "500+ Active Members",
      description: "Growing community of passionate tech enthusiasts",
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: "50+ Events Hosted",
      description: "Workshops, hackathons, and tech talks throughout the year",
    },
    {
      icon: <Award className="w-8 h-8 text-coral-600" />,
      title: "25+ Projects Built",
      description: "Collaborative projects solving real-world problems",
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple-600" />,
      title: "10+ Startups Launched",
      description: "Member-founded startups that grew from club projects",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-coral-100 text-coral-700 hover:bg-coral-200">🚀 About OCEM Techies</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Empowering the Next
              </span>
              <br />
              <span className="text-gray-900">Generation of Innovators</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              OCEM Techies is more than just a student club—we're a vibrant community of dreamers, builders, and
              innovators who believe that technology can change the world. Founded in 2020, we've grown from a small
              group of passionate students to a thriving ecosystem of over 500 members.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <Card className="text-center p-8 border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To create an inclusive environment where students can learn, collaborate, and innovate with technology
                  while building meaningful connections that last beyond their academic journey.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading student tech community that bridges the gap between academic learning and industry
                  practice, producing graduates who are ready to make an impact from day one.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-coral-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-coral-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Innovation, collaboration, inclusivity, and continuous learning. We believe in supporting each other's
                  growth while pushing the boundaries of what's possible with technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Our Achievements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Numbers that reflect our commitment to excellence and community growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">{achievement.icon}</div>
                  <CardTitle className="text-xl">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to a thriving tech community—here's how we've grown.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-600"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? "" : "flex-row-reverse"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <Badge className="w-fit bg-purple-100 text-purple-700 mb-2">{milestone.year}</Badge>
                        <CardTitle className="text-xl">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-purple-600 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals who make OCEM Techies a thriving community of innovation and learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm opacity-90">{member.role}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <Button asChild>
                      <Link href={member.social.github}>
                        <Github className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={member.social.linkedin}>
                        <Linkedin className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={member.social.twitter}>
                        <Twitter className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
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
            <h2 className="text-3xl lg:text-4xl font-bold">Ready to Join Our Community?</h2>
            <p className="text-xl opacity-90">
              Be part of something bigger. Connect with like-minded individuals, work on exciting projects, and shape
              the future of technology together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link href="/auth/register">
                  <Users className="w-5 h-5 mr-2" />
                  Join OCEM Techies
                </Link>
              </Button>
              <Button
                className="border-white text-white hover:bg-white hover:text-purple-600"
                asChild
              >
                <Link href="/events">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Events
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
                <Link href="#" className="text-gray-400 hover:text-white transition-colors block">
                  FAQ
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <Button className="hover:bg-purple-600">
                  <Github className="w-4 h-4" />
                </Button>
                <Button className="hover:bg-blue-600">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button className="hover:bg-blue-500">
                  <Twitter className="w-4 h-4" />
                </Button>
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
