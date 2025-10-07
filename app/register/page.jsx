"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Mail, Building2, Phone, X, Eye, EyeOff } from "lucide-react"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { BASE_URL } from "@/src/components/BaseUrl"

const Register = () => {
  const [activeTab, setActiveTab] = useState("email")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "individual"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    name: ""
  })
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ""
      })
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError("")
    }
  }

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value || ""
    })
    
    // Clear phone error when user starts typing
    if (fieldErrors.phone) {
      setFieldErrors({
        ...fieldErrors,
        phone: ""
      })
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError("")
    }
  }

  const validateForm = () => {
    let isValid = true
    const newFieldErrors = {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      name: ""
    }

    // Name validation
    if (!formData.name.trim()) {
      newFieldErrors.name = "Please enter your full name"
      isValid = false
    }

    // Phone validation
    if (!formData.phone) {
      newFieldErrors.phone = "Please enter your phone number"
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      newFieldErrors.password = "Please enter password"
      isValid = false
    } else if (formData.password.length < 6) {
      newFieldErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newFieldErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    // Email validation (only if email tab is active)
    if (activeTab === "email") {
      if (!formData.email) {
        newFieldErrors.email = "Please enter email address"
        isValid = false
      } else {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          newFieldErrors.email = "Please enter a valid email address"
          isValid = false
        }
      }
    }

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions")
      isValid = false
    }

    setFieldErrors(newFieldErrors)
    return isValid
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      }

      // Use proxy route instead of direct API call
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Registration successful! Please login...")
        
        // Redirect to login after a brief delay
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        // Handle specific error messages from the server
        if (data.error === "Email already registered.") {
          setFieldErrors({
            ...fieldErrors,
            email: "This email is already registered. Please use a different email or try logging in."
          })
        } else if (data.message && data.message.includes("email")) {
          setFieldErrors({
            ...fieldErrors,
            email: data.message
          })
        } else if (data.message && data.message.includes("phone")) {
          setFieldErrors({
            ...fieldErrors,
            phone: data.message
          })
        } else {
          setError(data.message || "Registration failed. Please try again.")
        }
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-white text-white py-5 px-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-lg border border-white/30"
            >
              <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#05164d]">Create Account</h2>
            <p className="text-[#05164d] mt-1 text-sm">Join our business management platform</p>
          </div>

          <div className="space-y-4 p-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start"
              >
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start"
              >
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter Your Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${fieldErrors.name ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                  />
                  {fieldErrors.name && (
                    <div className="absolute right-3 top-3 text-red-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className={`react-phone-input-container ${fieldErrors.phone ? 'error' : ''}`}>
                  <PhoneInput
                    international
                    defaultCountry="AE"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${fieldErrors.phone ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="abc234@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${fieldErrors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                  />
                  {fieldErrors.email && (
                    <div className="absolute right-3 top-3 text-red-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${fieldErrors.password ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {fieldErrors.password && (
                    <div className="absolute right-10 top-3 text-red-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${fieldErrors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {fieldErrors.confirmPassword && (
                    <div className="absolute right-10 top-3 text-red-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="terms-email"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    required
                  />
                </div>
                <label htmlFor="terms-email" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <button 
                    type="button"
                    onClick={() => setTermsModalOpen(true)} 
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>

              <motion.button 
                whileHover={{ scale: agreedToTerms && !loading ? 1.02 : 1 }}
                whileTap={{ scale: agreedToTerms && !loading ? 0.98 : 1 }}
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md transition-all duration-200 font-medium" 
                disabled={loading || !agreedToTerms}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button 
                  onClick={() => router.push("/login")} 
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Terms and Conditions Modal */}
      {termsModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-2xl">
              <h3 className="text-xl font-semibold">Terms and Conditions</h3>
              <button 
                onClick={() => setTermsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-auto p-6 flex-grow">
              <div className="space-y-6 text-gray-700">
                <p className="font-medium text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">1. Acceptance of Terms</h3>
                  <p className="text-gray-600 leading-relaxed">
                    By accessing or using our business management platform, you agree to be bound by these Terms and Conditions. 
                    If you do not agree to all of these terms, you may not access or use our services.
                  </p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">2. Account Registration</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You must provide accurate, current and complete information during the registration process and keep your account information updated.
                    You are responsible for safeguarding your password and for all activities that occur under your account.
                  </p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">3. User Responsibilities</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our services:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
                    <li>In any way that violates any applicable law or regulation</li>
                    <li>To transmit, or procure the sending of, any advertising or promotional material</li>
                    <li>To impersonate or attempt to impersonate the company, an employee, another user, or any other person or entity</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">4. Intellectual Property</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The platform and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">5. Privacy Policy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your registration data and other personally identifiable information are subject to our Privacy Policy, which explains how we collect, use, and disclose information that pertains to your privacy.
                  </p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">6. Termination</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">7. Limitation of Liability</h3>
                  <p className="text-gray-600 leading-relaxed">
                    In no event shall we, nor our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the services.
                  </p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">8. Governing Law</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
                  </p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">9. Changes to Terms</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our services after any revisions become effective, you agree to be bound by the revised terms.
                  </p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">10. Contact Information</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you have any questions about these Terms, please contact us at support@company.com.
                  </p>
                </section>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTermsModalOpen(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all font-medium shadow-md"
              >
                I Understand
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Register