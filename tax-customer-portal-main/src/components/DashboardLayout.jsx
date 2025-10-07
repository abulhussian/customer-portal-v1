"use client"

import Sidebar from "./Sidebar"
import { useState, useEffect, createContext, useContext } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
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

const FilterModalContext = createContext();
export const useFilterModal = () => useContext(FilterModalContext);

export default function DashboardLayout({ children, isOpen, setIsOpen, currentPath }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { currentUser, logout } = useAuth()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

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
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [setIsOpen])

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
    <FilterModalContext.Provider
      value={{
        isFilterModalOpen,
        setIsFilterModalOpen,
        isFormModalOpen,
        setIsFormModalOpen,
      }}
    >
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        
        {/* Top Header Section - Hidden on mobile when sidebar is open */}
        {(!isMobile || !isOpen) && (
          <div 
            className="flex-shrink-0 w-full pb-4"
            style={{
              backgroundColor: "#541DA0",
            }}
          >
            <div className="flex justify-between items-center px-4 py-2 mt-2">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  {isMobile && !isOpen && (
                    <button
                      onClick={() => setIsOpen(true)}
                      className="p-2 rounded-md bg-white/20 text-white"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                  )}
                  <div 
                    className="rounded-xl flex items-center justify-center shadow-lg bg-white/20 cursor-pointer" 
                    onClick={() => router.push("/dashboard")}
                  >
                    <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
                  </div>
                  <div onClick={() => router.push("/dashboard")} className="cursor-pointer">
                    <h1 className="font-bold text-xl text-white">Invertio.us</h1>
                  </div>
                </motion.div>
              </div>
              
              <div className="flex items-center gap-3 mt-2">
                <Avatar className="h-6 w-6 ring-2 ring-white/30">
                  <AvatarFallback className="bg-white/30 text-white font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base text-white truncate">{getUserName()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden bg-[#541DA0]">
          {/* Sidebar Container */}
          <div className={`flex-shrink-0 transition-all duration-300 ${
            isFilterModalOpen || isFormModalOpen ? "blur-sm" : ""
          }`}>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} currentPath={currentPath} />
          </div>

          {/* Main Content */}
          <div 
            className={`flex-1 flex flex-col overflow-hidden bg-white transition-all duration-300 ${
              isMobile ? "rounded-none" : "rounded-tl-[50px]"
            } ${isOpen && isMobile ? "hidden" : "block"}`}
          >
            <div className="flex-1  w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </FilterModalContext.Provider>
  )
}