
"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("userProfile")
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser))
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("userProfile")
        }
      }
      setLoading(false)
    }
  }, [])

  const login = (user) => {
    setCurrentUser(user)
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(user)) //  fixed key
    }
  }

  const logout = async () => {
    try {
      setCurrentUser(null)
      if (typeof window !== "undefined") {
        // localStorage.removeItem("userProfile") // ✅ remove only our key
        localStorage.clear()
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
