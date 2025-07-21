"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import EmployerDashboard from "@/components/dashboard/EmployerDashboard"
import JobSeekerDashboard from "@/components/dashboard/JobSeekerDashboard"
import Navbar from "@/components/Navbar"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {user.role === "admin" && <AdminDashboard />}
        {user.role === "employer" && <EmployerDashboard />}
        {user.role === "job_seeker" && <JobSeekerDashboard />}
      </div>
    </div>
  )
}
