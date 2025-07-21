"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Briefcase, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

interface JobDetail {
  id: number
  title: string
  description: string
  requirements: string
  location: string
  job_type: string
  salary_min: number
  salary_max: number
  company_name: string
  company_description: string
  category_name: string
  created_at: string
  first_name: string
  last_name: string
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    fetchJobDetail()
  }, [params.id])

  const fetchJobDetail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data)
      } else {
        toast({
          title: "Error",
          description: "Job not found",
          variant: "destructive",
        })
        router.push("/jobs")
      }
    } catch (error) {
      console.error("Error fetching job:", error)
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to apply for jobs",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (user.role !== "job_seeker") {
      toast({
        title: "Access Denied",
        description: "Only job seekers can apply for jobs",
        variant: "destructive",
      })
      return
    }

    setApplying(true)

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: job?.id,
          coverLetter,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application submitted successfully!",
        })
        setShowApplicationForm(false)
        setCoverLetter("")
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit application",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setApplying(false)
    }
  }

  const formatSalary = (min: number, max: number) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    }
    return "Salary not specified"
  }

  const formatJobType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job not found</h3>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Link href="/jobs">
              <Button>Browse Other Jobs</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/jobs" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{job.title}</CardTitle>
                <CardDescription className="text-lg font-medium text-gray-900">{job.company_name}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {formatJobType(job.job_type)}
                  </Badge>
                  {job.category_name && <Badge variant="outline">{job.category_name}</Badge>}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Posted {formatDate(job.created_at)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>About {job.company_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">
                    {job.company_description || "No company description available."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-semibold text-green-600">{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-semibold">{formatJobType(job.job_type)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold">{job.category_name || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted by</span>
                  <span className="font-semibold">
                    {job.first_name} {job.last_name}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Application Section */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">Please login to apply for this job</p>
                    <div className="space-y-2">
                      <Link href="/login" className="block">
                        <Button className="w-full">Login</Button>
                      </Link>
                      <Link href="/register" className="block">
                        <Button variant="outline" className="w-full bg-transparent">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : user.role !== "job_seeker" ? (
                  <div className="text-center">
                    <p className="text-gray-600">Only job seekers can apply for jobs</p>
                  </div>
                ) : !showApplicationForm ? (
                  <Button className="w-full" onClick={() => setShowApplicationForm(true)}>
                    Apply Now
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        placeholder="Write a brief cover letter explaining why you're interested in this position..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleApply} disabled={applying} className="flex-1">
                        {applying ? "Submitting..." : "Submit Application"}
                      </Button>
                      <Button variant="outline" onClick={() => setShowApplicationForm(false)} disabled={applying}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
