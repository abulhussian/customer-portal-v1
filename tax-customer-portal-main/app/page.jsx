
"use client"

import { useEffect } from "react"
import { useAuth } from "../src/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { currentUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (currentUser) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [currentUser, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}