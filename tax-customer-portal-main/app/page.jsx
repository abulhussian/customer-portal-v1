// "use client"

// import { useEffect } from "react"
// import { motion } from "framer-motion"
// import { AuthProvider, useAuth } from "../src/contexts/AuthContext"
// import ErrorBoundary from "../src/components/ErrorBoundary"
// import { useLocation, navigate } from "../src/utils/navigation"

// // Import all page components
// import Login from "../src/pages/Auth/Login"
// import Register from "../src/pages/Auth/Register"
// import Dashboard from "../src/pages/Dashboard"
// import Returns from "../src/pages/Returns"
// import Documents from "../src/pages/Documents"
// import ActivityLogs from "../src/pages/ActivityLogs"
// import Payments from "../src/pages/Payments"
// import Settings from "../src/pages/Settings"

// const SimpleRouter = () => {
//   const { pathname } = useLocation()
//   const { currentUser, loading } = useAuth()

//   useEffect(() => {
//     if (loading) return

//     const isAuthPage = pathname === "/login" || pathname === "/register"
//     if (!currentUser && !isAuthPage) {
//       navigate("/login")
//       return
//     }
//     if (currentUser && (pathname === "/" || isAuthPage)) {
//       navigate("/dashboard")
//       return
//     }
//   }, [pathname, currentUser, loading])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   const renderPage = () => {
//     switch (pathname) {
//       case "/login":
//         return <Login />
//       case "/register":
//         return <Register />
//       case "/dashboard":
//         return currentUser ? <Dashboard /> : <Login />
//       case "/dashboard/returns":
//         return currentUser ? <Returns /> : <Login />
//       case "/dashboard/documents":
//         return currentUser ? <Documents /> : <Login />
//       case "/dashboard/activity-logs":
//         return currentUser ? <ActivityLogs /> : <Login />
//       case "/dashboard/payments":
//         return currentUser ? <Payments /> : <Login />
//       case "/dashboard/settings":
//         return currentUser ? <Settings /> : <Login />
//       default:
//         return currentUser ? <Dashboard /> : <Login />
//     }
//   }

//   return (
//     <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//       {renderPage()}
//     </motion.div>
//   )
// }

// export default function App() {
//   return (
//     <ErrorBoundary>
//       <AuthProvider>
//         <SimpleRouter />
//       </AuthProvider>
//     </ErrorBoundary>
//   )
// }













// "use client"

// import { useEffect } from "react"
// import { motion } from "framer-motion"
// import { AuthProvider, useAuth } from "../src/contexts/AuthContext"
// import ErrorBoundary from "../src/components/ErrorBoundary"
// import { useRouter, usePathname } from "next/navigation"

// // Import all page components
// import Login from "../src/pages/Auth/Login"
// import Register from "../src/pages/Auth/Register"
// import Dashboard from "../src/pages/Dashboard"
// import Returns from "../src/pages/Returns"
// import Documents from "../src/pages/Documents"
// import ActivityLogs from "../src/pages/ActivityLogs"
// import Payments from "../src/pages/Payments"
// import Settings from "../src/pages/Settings"

// const SimpleRouter = () => {
//   const pathname = usePathname()
//   const router = useRouter()
//   const { currentUser, loading } = useAuth()

//   useEffect(() => {
//     if (loading) return

//     const isAuthPage = pathname === "/login" || pathname === "/register"
//     if (!currentUser && !isAuthPage) {
//       router.push("/login")
//       return
//     }
//     if (currentUser && (pathname === "/" || isAuthPage)) {
//       router.push("/dashboard")
//       return
//     }
//   }, [pathname, currentUser, loading, router])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   const renderPage = () => {
//     switch (pathname) {
//       case "/login":
//         return <Login />
//       case "/register":
//         return <Register />
//       case "/dashboard":
//         return currentUser ? <Dashboard /> : <Login />
//       case "/dashboard/returns":
//         return currentUser ? <Returns /> : <Login />
//       case "/dashboard/documents":
//         return currentUser ? <Documents /> : <Login />
//       case "/dashboard/activity-logs":
//         return currentUser ? <ActivityLogs /> : <Login />
//       case "/dashboard/payments":
//         return currentUser ? <Payments /> : <Login />
//       case "/dashboard/settings":
//         return currentUser ? <Settings /> : <Login />
//       default:
//         return currentUser ? <Dashboard /> : <Login />
//     }
//   }

//   return (
//     <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//       {renderPage()}
//     </motion.div>
//   )
// }

// export default function App() {
//   return (
//     <ErrorBoundary>
//       <AuthProvider>
//         <SimpleRouter />
//       </AuthProvider>
//     </ErrorBoundary>
//   )
// }




// app/page.jsx
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