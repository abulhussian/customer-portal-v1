// "use client"

// import { createContext, useContext, useState, useEffect } from "react"

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const savedUser = localStorage.getItem("userProfile")
//     if (savedUser) {
//       setCurrentUser(JSON.parse(savedUser))
//     }
//     setLoading(false)
//   }, [])

//   const login = (user) => {
//     setCurrentUser(user)
//     localStorage.setItem("userProfile", JSON.stringify(user))
//   }

//   const logout = async () => {
//     try {
//       setCurrentUser(null)
//       localStorage.removeItem("userProfile")
//     } catch (error) {
//       console.error("Logout error:", error)
//     }
//   }

//   const value = {
//     currentUser,
//     loading,
//     login,
//     logout,
//   }

//   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
// }


// // src/contexts/AuthContext.jsx
// "use client"

// import { createContext, useContext, useState, useEffect } from "react"

// const AuthContext = createContext(undefined)

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Check for user in localStorage
//     const savedUser = localStorage.getItem("userProfile")
//     if (savedUser) {
//       try {
//         setCurrentUser(JSON.parse(savedUser))
//       } catch (error) {
//         console.error("Error parsing saved user:", error)
//         localStorage.removeItem("userProfile")
//       }
//     }
//     setLoading(false)
//   }, [])

//   const login = (user) => {
//     setCurrentUser(user)
//     localStorage.setItem("userProfile", JSON.stringify(user))
//   }

//   const logout = async () => {
//     try {
//       setCurrentUser(null)
//       localStorage.removeItem("userProfile")
//     } catch (error) {
//       console.error("Logout error:", error)
//     }
//   }

//   const value = {
//     currentUser,
//     loading,
//     login,
//     logout,
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   )
// }




// src/contexts/AuthContext.jsx
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
