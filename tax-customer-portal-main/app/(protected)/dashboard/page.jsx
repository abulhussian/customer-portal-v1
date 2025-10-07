"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { FileText, FolderOpen, CreditCard, TrendingUp, Clock, Plus, ArrowRight, Activity } from "lucide-react"
// import { getStoredData, seedReturns, seedInvoices, seedActivityLogs } from "@/src/data/seed"
import { formatCurrency, formatDate } from "@/src/utils/validators"
import { BASE_URL } from "@/src/components/BaseUrl"

const Dashboard = () => {
  const [returns, setReturns] = useState([])
  const [invoices, setInvoices] = useState([])
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Get user data from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem("userProfile") || "{}")
      if (user && user.uid) {
        setUserId(user.uid)
      }
    }
  }, [])

  useEffect(() => {
    if (userId) {
      // Load returns and invoices from localStorage or seed data
      fetchReturns()
      loadInvoices()

      // Fetch activity logs from API
      fetchActivityLogs()
    }
  }, [userId])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/getInvoices/${userId}`, {

        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch invoices')
      }
      const apiInvoices = await response.json()
      console.log("API Invoices:", apiInvoices)

      const transformedInvoices = apiInvoices.map(invoice => ({
        id: invoice.id,
        customerId: invoice.customer_id,
        customerName: invoice.customer_name,
        returnName: invoice.tax_name,
        returnType: "Tax Return",
        invoiceAmount: Number(invoice.invoice_amount),
        status: invoice.status,
        createdAt: invoice.created_at,
        dueDate: invoice.due_date,
        createdByType: invoice.createdby_type
      }))

      console.log("Transformed Invoices:", transformedInvoices)

      setInvoices(transformedInvoices)
    } catch (error) {
      console.error('Error loading invoices:', error)
      alert("Error loading invoices. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  // console.log("Invoices:", invoices)


  const userToken = localStorage.getItem('token')
  const fetchReturns = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/getClientDashboard/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API response for returns:", data.returns)
      setReturns(data.returns || [])
    } catch (err) {
      console.error("Failed to fetch returns:", err)
      setError(err.message)
      // Fallback to seed data if API fails
      setReturns(("returns"))
    } finally {
      setLoading(false)
    }
  }



  const fetchActivityLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/getActivites/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Authorization": `Bearer ${userToken}`,
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setActivityLogs(data)
    } catch (err) {
      console.error("Failed to fetch activity logs:", err)
      setError(err.message)
      // Fallback to seed data if API fails
      setActivityLogs(("activityLogs"))
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalReturns: returns.length,
    pendingReturns: returns.filter((r) => r.return_status !== "completed" && r.return_status !== "document verified").length,
    completedReturns: returns.filter((r) => r.return_status === "completed" || r.return_status === "document verified").length,
    totalInvoices: invoices.length,
    unpaidInvoices: invoices.filter((i) => i.status === "pending").length,
    totalAmount: invoices.reduce((sum, invoice) => sum + invoice.invoiceAmount, 0),
    unpaidAmount: invoices.filter((i) => i.status === "pending").reduce((sum, invoice) => sum + invoice.invoiceAmount, 0),
  }
  // console.log("Dashboard stats:", invoices, stats)

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "document verified":
      case "filed return":
        return "bg-green-100 text-green-800"
      case "in review":
        return "bg-blue-100 text-blue-800"
      case "in preparation":
        return "bg-indigo-100 text-indigo-800"
      case "ready to file":
        return "bg-purple-100 text-purple-800"
      case "initial request":
        return "bg-amber-100 text-amber-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get only the 5 most recent returns, sorted by date (newest first)
  const recentReturns = returns
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  const recentActivity = activityLogs.slice(-4).reverse()

  return (
    loading ? (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ) : (
      <main className="flex flex-col overflow-hidden p-4 lg:pl-4 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Card 1 - Top Left Rounded */}
            <div className="shadow-lg hover:shadow-xl transition-all bg-[#8461B4] duration-300 border-0 rounded-tl-[20px] flex flex-col p-2 text-start rounded-sm">
              <div className="flex items-center  gap-2 text-white w-full">
                <div className="w-1/6 border-b-2 pb-2 border-[#604881] ">
                  <div className="p-1 flex justify-center items-center rounded-full bg-[#604881]">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-sm font-bold pb-2">Total Returns</h3>
              </div>
              <div className="text-2xl font-bold text-white mt-4 pl-2">{stats.totalReturns}</div>
            </div>

            {/* Card 2 - Normal */}
            <div className="shadow-lg hover:shadow-xl bg-[#FC6719] transition-all duration-300 border-0 flex flex-col p-2 text-start rounded-sm">
              <div className="flex items-center  gap-2 text-white w-full">
                <div className="w-1/6 border-b-2 pb-2 border-[#df530a] ">
                  <div className="p-1 flex justify-center items-center rounded-full bg-[#df530a]">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-sm font-bold pb-2">Pending Returns</h3>
              </div>
              <div className="text-2xl font-bold text-white mt-4 pl-2">{stats.pendingReturns}</div>
            </div>

            {/* Card 3 - Bottom Right Rounded */}
            <div className="shadow-lg hover:shadow-xl transition-all rounded-br-[20px] duration-300 border-0 overflow-hidden flex flex-col bg-[#4C56CC] p-2 text-start rounded-sm">
              <div className="flex items-center  gap-2 text-white ">
                <div className="w-1/6 border-b-2 pb-2 border-[#1d2587] ">
                  <div className="p-1 flex justify-center items-center rounded-full bg-[#1d2587]">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-sm font-bold pb-2">Outstanding Invoices</h3>
              </div>
              <div className="text-2xl font-bold text-white mt-4 pl-2">{stats.unpaidInvoices}</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Recent Returns */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Tax Returns</CardTitle>
                    <CardDescription>Your 5 most recent tax return filings</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/returns">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : returns.length > 0 ? (
                    <div className="space-y-2">
                      {recentReturns.map((returnItem) => (
                        <motion.div
                          key={returnItem.return_id}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Form {returnItem.return_type}</p>
                              <p className="text-sm text-gray-500">
                                Created {formatDate(returnItem.created_at)} • {returnItem.tax_name}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(returnItem.return_status)}>
                            {returnItem.return_status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No tax returns yet</p>
                      <Button asChild className="mt-2">
                        <Link href="/dashboard/returns">Create Your First Return</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-2">
                      <Activity className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-red-500">Failed to load activities</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchActivityLogs}
                        className="mt-1"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-2">
                      {recentActivity.map((activity, index) => (
                        <div key={activity.id || index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.comment || "Activity update"}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(activity.created_at || activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-md font-bold mb-3">Quick Actions</h2>
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-w-max">
                {/* New Tax Return */}
                <Link
                  href="/dashboard/returns"
                  className="border rounded-md p-3 flex flex-col items-center gap-1 hover:bg-gray-50 transition min-w-[200px]"
                >
                  <FileText className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">New Tax Return</span>
                  <span className="text-xs text-gray-500">Start a new filing</span>
                </Link>

                {/* View Invoices */}
                <Link
                  href="/dashboard/invoices"
                  className="border rounded-md p-3 flex flex-col items-center gap-1 hover:bg-gray-50 transition min-w-[200px]"
                >
                  <Activity className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">View Invoices</span>
                  <span className="text-xs text-gray-500">Check invoice status</span>
                </Link>

                {/* Payments */}
                <Link
                  href="/dashboard/payments"
                  className="border rounded-md p-3 flex flex-col items-center gap-1 hover:bg-gray-50 transition min-w-[200px]"
                >
                  <CreditCard className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">Payments</span>
                  <span className="text-xs text-gray-500">Track all payments</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    )
  )
}

export default Dashboard