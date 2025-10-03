"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "../../src/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Phone, Building2, Eye, EyeOff } from "lucide-react"
import {BASE_URL} from "@/src/components/BaseUrl"
import Image from "next/image"

const API_BASE_URL = `${BASE_URL}/api`

const Login = () => {
  const [activeTab, setActiveTab] = useState("email")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [step, setStep] = useState("input") // 'input' or 'verify'
  const [resendTimer, setResendTimer] = useState(0)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  // Timer for OTP resend
  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const startResendTimer = () => {
    setResendTimer(30)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    // Validate based on login method
    if (activeTab === "email") {
      if (!email || !password) {
        setError("Please enter both email and password")
        return
      }
    } else {
      if (!mobile || !password) {
        setError("Please enter both mobile number and password")
        return
      }
    }

    setLoading(true)
    setError("")

    try {
      const identifier = activeTab === "email" ? email.toLowerCase().trim() : mobile.trim()

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [activeTab === "email" ? "email" : "mobile"]: identifier,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep("verify")
        setSuccess("OTP sent successfully! Please check your email/mobile.")
        startResendTimer()
      } else {
        // Handle specific error cases
        if (data.message?.includes("not registered") || data.message?.includes("Account not found") || data.error?.includes("Account not found")) {
          setError("Email/mobile is not registered with us")
        } else if (data.message?.includes("inactive")) {
          setError("Your account is inactive. Please contact support.")
        } else if (data.message?.includes("password") || data.message?.includes("invalid credentials")) {
          setError("Password is incorrect")
        } else if (data.message?.includes("attempts")) {
          setError("Too many failed attempts. Your account has been temporarily locked.")
        } else {
          setError(data.message || data.error || "Failed to send OTP. Please try again.")
        }
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    
    setError("")
    setResendLoading(true)

    try {
      const identifier = activeTab === "email" ? email.toLowerCase().trim() : mobile.trim()
      
      // Use the login endpoint for resending OTP
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [activeTab === "email" ? "email" : "mobile"]: identifier,
          password: password,
          resend: true, // Add a flag to indicate this is a resend request
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("OTP resent successfully!")
        startResendTimer()
      } else {
        // Handle specific error cases for resend
        if (data.message?.includes("not registered") || data.message?.includes("Account not found") || data.error?.includes("Account not found")) {
          setError("Email/mobile is not registered with us")
        } else if (data.message?.includes("inactive")) {
          setError("Your account is inactive. Please contact support.")
        } else if (data.message?.includes("password") || data.message?.includes("invalid credentials")) {
          setError("Password is incorrect")
        } else if (data.message?.includes("attempts")) {
          setError("Too many failed attempts. Your account has been temporarily locked.")
        } else {
          setError(data.message || data.error || "Failed to resend OTP. Please try again.")
        }
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setResendLoading(false)
    }
  }

  const handleOTPVerification = async (e) => {
    e.preventDefault()

    if (!otp) {
      setError("Please enter the OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const identifier = activeTab === "email" ? email.toLowerCase().trim() : mobile.trim()
      
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [activeTab === "email" ? "email" : "mobile"]: identifier,
          otp: otp,
        }),
      })

      const data = await response.json()

      const token = data.token
      localStorage.setItem("token", token)

      if (response.ok) {
        const userData = {
          uid: data.user.id,
          email: data.user.email,
          displayName: data.user.name,
          token: data.token,
          role : data.user.role
        }

        login(userData)

        // show loader before navigating
        setTimeout(() => {
          router.push("/dashboard")
        }, 800) // short delay so "Verifying..." shows
      } else {
        if (data.message?.includes("invalid") || data.message?.includes("incorrect")) {
          setError("OTP is incorrect. Please try again.")
        } else {
          setError(data.message || data.error || "Verification failed. Please try again.")
        }
        setLoading(false) // reset if failed
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep("input")
    setOtp("")
    setError("")
    setSuccess("")
  }

  const handleSignUpRedirect = () => {
    router.push("/register")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex justify-center"
            >
              <Image 
                src="/favicon.svg" 
                alt="Invertio Logo" 
                width={120} 
                height={40} 
                className="h-10 w-auto"
              />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">Sign in your account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-pulse">
                <AlertDescription className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Tabs, forms etc remain unchanged */}
            {/* ... keep rest of your code as it is ... */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login
