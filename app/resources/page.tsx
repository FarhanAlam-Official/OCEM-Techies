"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Code, Calendar, User, ArrowRight, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url?: string
  category: string
  tags: string[]
  is_published: boolean
  author: {
    first_name: string
    last_name: string
    profile_image_url?: string
  }
  created_at: string
  updated_at: string
}

export default function ResourcesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categories = ["Tutorial", "Insights", "Backend", "Frontend", "Mobile", "DevOps", "AI/ML", "Career"]

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm, categoryFilter])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          author:users!author_id(first_name, last_name, profile_image_url)
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => post.category === categoryFilter)
    }

    setFilteredPosts(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-coral-100 text-coral-700 hover:bg-coral-200">📚 Tech Resources & Tutorials</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Learn, Grow, and
              </span>
              <br />
              <span className="text-gray-900">Share Knowledge</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover insightful articles, tutorials, and resources created by our community of passionate developers.
              From beginner guides to advanced techniques, find everything you need to level up your tech skills.
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
                Filter Articles
              </CardTitle>
              <CardDescription>Find articles that match your interests and learning goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Articles</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by title, content, or tags..."
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
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Article */}
      {filteredPosts.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  <Image
                    src={filteredPosts[0].featured_image_url || "/placeholder.svg?height=300&width=600"}
                    alt={filteredPosts[0].title}
                    width={600}
                    height={300}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-800">
                      {filteredPosts[0].category}
                    </Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold">{filteredPosts[0].title}</h3>
                    <p className="text-gray-600 leading-relaxed">{filteredPosts[0].excerpt}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {filteredPosts[0].author.first_name} {filteredPosts[0].author.last_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(filteredPosts[0].created_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {getReadingTime(filteredPosts[0].content)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {filteredPosts[0].tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} className="border text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      className="w-fit bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      asChild
                    >
                      <Link href={`/resources/${filteredPosts[0].slug}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <div className="text-sm text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
            </div>
          </div>

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
          ) : filteredPosts.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <Image
                      src={post.featured_image_url || "/placeholder.svg?height=200&width=400"}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-800">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author.first_name} {post.author.last_name}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {getReadingTime(post.content)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} className="border text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge className="border text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                      <Button className="hover:bg-transparent h-9 rounded-md px-3" asChild>
                        <Link href={`/resources/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search or filters to find more content.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">Want to Share Your Knowledge?</h2>
            <p className="text-xl opacity-90">
              Join our community of writers and share your expertise with fellow developers. Help others learn and grow
              while building your personal brand.
            </p>
            <Button className="h-11 rounded-md px-8 bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="/auth/register">
                <BookOpen className="w-5 h-5 mr-2" />
                Start Writing
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
              <h4 className="font-semibold">Categories</h4>
              <div className="space-y-2 text-sm">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={category}
                    href={`/resources?category=${category}`}
                    className="text-gray-400 hover:text-white transition-colors block"
                  >
                    {category}
                  </Link>
                ))}
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
