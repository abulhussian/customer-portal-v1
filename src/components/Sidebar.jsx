"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import {
  FileText,
  Activity,
  CreditCard,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
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

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [setIsOpen])

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: FileText, description: "Overview" },
    { name: "Returns", href: "/dashboard/returns", icon: Receipt, description: "Manage tax returns" },
    { name: "Invoices", href: "/dashboard/invoices", icon: Activity, description: "View invoice history" },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard, description: "Payments" },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
      {/* Mobile hamburger menu */}
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

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (isOpen ? 0 : -240) : 0,
          width: isCollapsed ? 80 : 240,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 z-50 h-full lg:relative lg:h-[600px] flex flex-col relative`}
        style={{
          backgroundColor: "#541DA0",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border/10">
          {/* Close button (mobile) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="lg:hidden h-8 w-8 p-0 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2 space-y-2">
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
                    className={`flex items-center gap-2 px-4 py-2 my-4 rounded-xl transition-all duration-200 ${isActive
                      ? "bg-[#FC6719] text-white shadow-md"
                      : "text-white hover:bg-white hover:text-[#8461B4]"
                      }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setIsOpen(false)
                      }
                    }}
                  >
                    <Icon className={`${isCollapsed ? "w-6 h-6 mx-auto" : "w-5 h-5"}`} />
                    {!isCollapsed && (
                      <div className="flex-1">
                        <p className="font-semibold text-base">{item.name}</p>
                        <p className="text-xs">{item.description}</p>
                      </div>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section - Collapse Button and Sign Out */}
                {/* Bottom Section - Collapse Button and Sign Out */}
      <div className="flex items-center justify-between mt-auto border-t border-sidebar-border/30 px-4 py-2">
  {/* Sign Out */}
  {currentUser && (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center justify-center bg-[#FC6719] text-white hover:bg-white hover:text-[#8461B4] transition-colors duration-200 py-2 px-3"
    >
      <LogOut className="w-5 h-5" />
      {!isCollapsed && <span className="ml-2">Sign Out</span>}
    </Button>
  )}

  {/* Collapse toggle */}
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setIsCollapsed(!isCollapsed)}
    className="hidden lg:flex h-8 w-8 p-0 text-white bg-[#FC6719] hover:bg-white"
  >
    {isCollapsed ? (
      <ChevronRight className="w-7 h-7" />
    ) : (
      <ChevronLeft className="w-7 h-7" />
    )}
  </Button>
</div>


      </motion.aside>
    </>
  )
}

export default Sidebar