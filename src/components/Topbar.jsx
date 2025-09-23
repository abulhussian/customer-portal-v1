// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Button } from "../../components/ui/button"
// import { Avatar, AvatarFallback } from "../../components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu"
// import { Badge } from "../../components/ui/badge"
// import { Menu, Bell, Search, User, Settings, LogOut } from "lucide-react"
// import { useAuth } from "../contexts/AuthContext"

// const Topbar = ({ onMenuClick }) => {
//   const [notifications] = useState([
//     { id: 1, message: "New document uploaded", time: "2 min ago" },
//     { id: 2, message: "Invoice payment received", time: "1 hour ago" },
//     { id: 3, message: "Tax return status updated", time: "3 hours ago" },
//   ])

//   const { currentUser, logout } = useAuth()

//   const getUserInitials = () => {
//     const profile = JSON.parse(localStorage.getItem("userProfile") || "{}")
//     if (profile.firstName && profile.lastName) {
//       return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
//     }
//     return currentUser?.email?.[0]?.toUpperCase() || "U"
//   }

//   const getUserName = () => {
//     const profile = JSON.parse(localStorage.getItem("userProfile") || "{}")
//     if (profile.firstName && profile.lastName) {
//       return `${profile.firstName} ${profile.lastName}`
//     }
//     return currentUser?.email || "User"
//   }

//   const handleLogout = async () => {
//     try {
//       await logout()
//     } catch (error) {
//       console.error("Logout error:", error)
//     }
//   }

//   return (
//     <motion.header
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6"
//     >
//       <div className="flex items-center justify-between">
//         {/* Left side */}
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
//             <Menu className="w-5 h-5" />
//           </Button>

//           <div className="hidden md:flex items-center gap-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search documents, returns..."
//                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Right side */}
//         <div className="flex items-center gap-3">
//           {/* Notifications */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="sm" className="relative">
//                 <Bell className="w-5 h-5" />
//                 {notifications.length > 0 && (
//                   <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
//                     {notifications.length}
//                   </Badge>
//                 )}
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-80">
//               <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               {notifications.map((notification) => (
//                 <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
//                   <p className="text-sm font-medium">{notification.message}</p>
//                   <p className="text-xs text-gray-500">{notification.time}</p>
//                 </DropdownMenuItem>
//               ))}
//               {notifications.length === 0 && (
//                 <DropdownMenuItem disabled>
//                   <p className="text-sm text-gray-500">No new notifications</p>
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* User menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="flex items-center gap-2 px-2">
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
//                     {getUserInitials()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="hidden md:block text-left">
//                   <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
//                   <p className="text-xs text-gray-500">Professional</p>
//                 </div>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <User className="w-4 h-4 mr-2" />
//                 Profile
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Settings className="w-4 h-4 mr-2" />
//                 Settings
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Sign Out
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </motion.header>
//   )
// }

// export default Topbar




"use client"

import { Menu } from "lucide-react"
import { Button } from "../../components/ui/button"

export default function Topbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <header 
      className="shadow-sm border-b border-gray-200 relative"
      style={{
        backgroundImage: "url('/Group 466497.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="flex items-center justify-between px-4 py-7 relative z-10" style={{borderTopRightRadius:"200px"}}>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden bg-white/20 hover:bg-white/30 text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white ml-2">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Add your user menu or other topbar items here */}
        </div>
      </div>
    </header>
  )
}