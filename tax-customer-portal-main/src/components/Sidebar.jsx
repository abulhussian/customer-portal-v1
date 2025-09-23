"use client"

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

const Sidebar = ({ isOpen, setIsOpen, currentPath }) => {
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
    <>
      {/* Mobile hamburger menu button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-md bg-sidebar text-white shadow-md"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile backdrop */}
      {isOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      

      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (isOpen ? 0 : -200) : 0,
          width: isCollapsed ? 80 : 200,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed  left-0 top-0 z-50 h-full  lg:relative  ${isCollapsed ? "lg:w-30" : "lg:w-80"} relative`}
        style={{
          backgroundColor: "#541DA0",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // background: "white",
        }}
      >
        
        
        <div className="flex flex-col  relative z-10 ">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border/10">
           

            <div className="flex items-center  gap-2 ">
              {/* Collapse toggle (desktop only) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex h-8 w-8 p-0 text-white absolute top-4 right-0 hover:bg-white/20"
              >
                {isCollapsed ? <ChevronRight className="w-7 h-7" /> : <ChevronLeft className="w-7 h-7" />}
              </Button>

              {/* Close button (mobile only) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="lg:hidden h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = currentPath === item.href
              const Icon = item.icon

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white shadow-md"
                        : "text-white hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1024) {
                        setIsOpen(false)
                      }
                    }}
                  >
                    <Icon className={`${isCollapsed ? "w-6 h-6 mx-auto" : "w-5 h-5"}`} />
                    {!isCollapsed && (
                      <div className="flex-1">
                        <p className="font-semibold text-base">{item.name}</p>
                        <p className="text-xs text-white/30">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border/30">
            

            {!isCollapsed && currentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full mt-3 justify-start text-white hover:bg-red-500/30"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar