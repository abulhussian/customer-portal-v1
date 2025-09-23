"use client"

import ProtectedRoute from "@/src/components/ProtectedRoute"

export default function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
