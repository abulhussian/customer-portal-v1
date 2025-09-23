// src/components/DashboardLayout.jsx
"use client"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import {
  FileText,
  FolderOpen,
  Activity,
  CreditCard,
  Settings,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Menu,
  Receipt
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function DashboardLayout({ children, isOpen, setIsOpen, currentPath }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      
      // Automatically show sidebar on desktop, hide on mobile
      if (!mobile) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
    
    // Initial check
    checkScreenSize()
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [setIsOpen])

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: FileText,
      description: "Overview",
    },
    {
      name: "Returns",
      href: "/dashboard/returns",
      icon: Receipt,
      description: "Manage tax returns",
    },
    {
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: Activity,
      description: "View invoice history",
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
      description: " payments",
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getUserInitials = () => {
    if (!currentUser) return "U"
    
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    }
    return currentUser.email?.[0]?.toUpperCase() || "U"
  }

  const getUserName = () => {
    if (!currentUser) return "User"
    
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`
    }
    return currentUser.email || "User"
  }
  return (
    <div className="flex h-screen bg-gray-50" >
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-white relative" >
        {/* Page Content */}
        <main className="flex-1  pt-4 pb-0 pr-0 z-9"style={{
          backgroundColor: "#541DA0",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // background: "white",
        }}>
          {/* <div className="flex"> */}
         <div className="flex justify-between">
          <div className="ml-4">
          <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="rounded-xl flex items-center justify-center shadow-lg bg-white/20" onClick={() => router.push("/dashboard")}>
                  <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
                </div>
                <div onClick={() => router.push("/dashboard")} className="cursor-pointer">
                  <h1 className="font-bold text-md text-white">Invertio.us</h1>
                </div>
              </motion.div>
              </div>
              <div className={`flex items-center mr-5  gap-3 ${isCollapsed ? "justify-center" : ""}`}>
              <Avatar className="h-10 w-10 ring-2 ring-white/30 mb-6">
                <AvatarFallback className="bg-white/30 text-white font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 mb-6">
                  <p className="font-semibold text-base text-white truncate">{getUserName()}</p>
                  {/* <p className="text-sm text-white/90 truncate">
                    {currentUser?.email || "Not signed in"}
                  </p> */}
                </div>
              )}
            </div>
         </div>
         {/* </div> */}

          <div  className="z-10">
            <div className="flex">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} currentPath={currentPath} />
          <div className="flex-1 z-2 w-full h-full pl-2 pt-0 pr-0  bg-white z-11"style={{ borderTopLeftRadius: "50px" }}>
          {children}
          </div>
          </div>

          </div>
          
        </main>
      </div>
    </div>
  )
}
