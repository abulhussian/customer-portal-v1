// app/dashboard/layout.js
"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import DashboardLayout from "../../../src/components/DashboardLayout.jsx"

export default function DashboardRootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const currentPath = usePathname()

  return (
    <DashboardLayout 
      isOpen={sidebarOpen} 
      setIsOpen={setSidebarOpen} 
      currentPath={currentPath}
    >
      {children}
    </DashboardLayout>
  )
}