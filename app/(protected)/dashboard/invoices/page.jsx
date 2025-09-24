"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Receipt, Download, Eye, Edit, X, User, CreditCard, CheckCircle, Clock, AlertCircle, FileText, Search, Filter } from "lucide-react"
import { BASE_URL } from "@/src/components/BaseUrl"
import { pdf, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as numberToWords from 'number-to-words';

// Register fonts if needed (optional)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ]
});

// Format date function - moved outside main component
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottom: '2 solid #e5e7eb',
    paddingBottom: 8
  },
  companyInfo: {
    flex: 1
  },
  invoiceInfo: {
    textAlign: 'right'
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5
  },
  text: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 3
  },
  bold: {
    fontWeight: 400
  },
  section: {
    marginBottom: 8
  },
  table: {
    width: '100%',
    marginTop: 8,
    marginBottom: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 350
  },
  tableCell: {
    padding: 8,
    flex: 1,
    fontSize: 9 // Reduced from 10
  },
  tableCellRight: {
    padding: 8,
    flex: 1,
    textAlign: 'right',
    fontSize: 9 // Reduced from 10
  },
  totalRow: {
    backgroundColor: '#e3f2fd',
    fontWeight: 200
  },
  bankDetails: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 8
  },
  notes: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    borderLeft: '4 solid #3b82f6'
  },
  circleContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  redText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold'
  },
  greyText: {
    color: 'grey',
    fontSize: 12,
    fontWeight: 'bold'
  }
});

// Create Invoice Document component
const InvoiceDocument = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Image
            src="/invertio-logo-full.jpg"
            style={{ width: 80, height: 80, marginBottom: 10 }}
          />
          <Text style={styles.title}>Invertio Solutions</Text>
          <Text style={styles.text}>5 Penn Plaza, 14th Floor, New York, NY 10001, US</Text>
          <Text style={styles.text}>GSTIN: 36AAHCJ2304M1ZK</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.title}>TAX INVOICE</Text>
          <Text style={styles.text}><Text style={styles.bold}>Invoice #:</Text> {invoice.id}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Invoice Date:</Text> {formatDate(invoice.createdAt)}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Due Date:</Text> {formatDate(invoice.dueDate)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Bill to:</Text>
        <Text style={[styles.text, styles.bold]}>{invoice.customerName}</Text>
        <Text style={styles.text}>Customer ID: {invoice.customerId}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Service Details:</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Return Type</Text>
            <Text style={styles.tableCellRight}>Amount (USD)</Text>
          </View>

          {/* Table Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{invoice.returnType}</Text>
            <Text style={styles.tableCell}>{invoice.returnName}</Text>
            <Text style={styles.tableCellRight}>${invoice.invoiceAmount.toFixed(2)}</Text>
          </View>
          {/* Table Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{invoice.returnName}</Text>
            <Text style={styles.tableCell}>{invoice.returnType}</Text>
            <Text style={styles.tableCellRight}>${invoice.invoiceAmount.toFixed(2)}</Text>
          </View>

          {/* Subtotal Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell]}></Text>
            <Text style={[styles.tableCell, { textAlign: 'right', fontSize: 9 }]}>Subtotal</Text>
            <Text style={[styles.tableCellRight, { fontSize: 9 }]}>${invoice.invoiceAmount.toFixed(2)}</Text>
          </View>

          {/* Payment Platform Fee Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell]}></Text>
            <Text style={[styles.tableCell, { textAlign: 'right', fontSize: 9 }]}>Payment Platform Fee</Text>
            <Text style={[styles.tableCellRight, { fontSize: 9 }]}>$19.00</Text>
          </View>

          {/* Total Row */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.tableCell, styles.bold]}></Text>
            <Text style={[styles.tableCell, styles.bold, { textAlign: 'right', fontSize: 9 }]}>Total</Text>
            <Text style={[styles.tableCellRight, styles.bold, { fontSize: 9 }]}>${(invoice.invoiceAmount + 19).toFixed(2)}</Text>
          </View>

          {/* Total in Words Row */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.tableCell, styles.bold, { textAlign: 'center', fontSize: 9 }]} colSpan={3}>
              Total in words: {numberToWords.toWords(invoice.invoiceAmount + 19).replace(/\b\w/g, l => l.toUpperCase())} Dollars Only
            </Text>
          </View>
        </View>


      </View>

      <View style={styles.bankDetails}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={styles.circleContainer}>
            <Text>
              <Text style={styles.redText}>CF</Text>
              <Text style={styles.greyText}>SB</Text>
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.subtitle, styles.bold]}>Bank Details:</Text>
            <Text style={styles.text}><Text style={styles.bold}>Bank Name:</Text> Community Federal Savings Bank</Text>
            <Text style={styles.text}><Text style={styles.bold}>Account Holder:</Text> INVERTIO SOLUTIONS PRIVATE LIMITED</Text>
            <Text style={styles.text}><Text style={styles.bold}>Account Number:</Text> 8331054346</Text>
            <Text style={styles.text}><Text style={styles.bold}>ACH Routing Number:</Text> 026073150</Text>
            <Text style={styles.text}><Text style={styles.bold}>Fedwire Routing Number:</Text> 026073008</Text>
            <Text style={styles.text}><Text style={styles.bold}>Address:</Text> 5 Penn Plaza, 14th Floor, New York, NY 10001, US</Text>
          </View>
        </View>
      </View>

      <View style={styles.notes}>
        <Text style={[styles.text, styles.bold]}>Notes:</Text>
        <Text style={styles.text}>Thank you for your continued trust in our services.</Text>
      </View>
    </Page>
  </Document>
);

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isPaying, setIsPaying] = useState(false)
  const [payingInvoiceId, setPayingInvoiceId] = useState(null)
  const [viewInvoice, setViewInvoice] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // ✅ default 10 rows

  // Calculate pagination values
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredInvoices.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);

  const userToken = localStorage.getItem('token')

  useEffect(() => {
    try {
      const userString = localStorage.getItem('userProfile')

      const user = userString ? JSON.parse(userString) : null
      if (user) {
        const loggedInUser = {
          id: user?.uid,
          name: user?.displayName,
          email: user?.email,
          role: user?.role
        }
        console.log(loggedInUser)
        setCurrentUser(loggedInUser)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currentUser?.id) {
      loadInvoices()
    }
  }, [currentUser])

  useEffect(() => {
    filterInvoices()
    setCurrentPage(1); // Reset to first page when filters change
  }, [invoices, filterStatus, searchTerm])

  const loadInvoices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${BASE_URL}/api/getInvoices/${currentUser?.id}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch invoices')
      }
      const apiInvoices = await response.json()

      const transformedInvoices = apiInvoices.map(invoice => ({
        id: invoice.id,
        customerId: invoice.customer_id,
        customerName: invoice.customer_name,
        returnName: invoice.tax_name,
        returnType: "Tax Return",
        invoiceAmount: parseFloat(invoice.invoice_amount),
        status: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
        createdAt: invoice.created_at,
        dueDate: invoice.due_date,
        createdByType: invoice.createdby_type
      }))

      setInvoices(transformedInvoices)
    } catch (error) {
      console.error('Error loading invoices:', error)
      alert("Error loading invoices. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const filterInvoices = () => {
    let filtered = invoices

    if (filterStatus !== "all") {
      filtered = filtered.filter((invoice) =>
        invoice.status.toLowerCase() === filterStatus.toLowerCase()
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.returnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.returnType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.id.toString().includes(searchTerm)
      )
    }

    setFilteredInvoices(filtered)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
      case 'pending': return 'bg-gradient-to-r from-amber-400 to-amber-500 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewInvoice = (invoice) => {
    setViewInvoice(invoice)
  }

  const handleDownloadInvoice = async (invoice) => {
    setIsDownloading(true);

    try {
      // Create PDF blob
      const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();

      // Download the file
      saveAs(blob, `invoice-${invoice.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const payNow = async (invoice) => {
    setIsPaying(true)
    setPayingInvoiceId(invoice.id)

    try {
      const requestBody = {
        amount: invoice.invoiceAmount,
        currency: 'USD',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          invoice_id: invoice.id,
          customer_name: invoice.customerName
        },
        invoice_id: invoice.id,
        createdby_type: currentUser.role,
        createdby_id: currentUser.id
      }
      const response = await fetch(`${BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create order')
      }

      const order = await response.json()

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'TaxPortal',
          description: `Payment for Invoice ${invoice.id}`,
          order_id: order.id,
          prefill: {
            name: currentUser.name,
            email: currentUser.email,
          },
          theme: {
            color: '#2563EB'
          },
          method: {
            card: true,
            netbanking: false,
            wallet: false,
            upi: false,
            emi: false
          },
          handler: async function (response) {
            try {
              const verifyResponse = await fetch(`${BASE_URL}/api/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              })

              const data = await verifyResponse.json()

              if (data.status === 'ok') {
                const updatedInvoices = invoices.map(inv =>
                  inv.id === invoice.id ? { ...inv, status: 'Paid' } : inv
                )
                setInvoices(updatedInvoices)
                alert('Payment successful! Invoice status updated to Paid.')
                loadInvoices()
              } else {
                alert('Payment verification failed')
              }
            } catch (error) {
              console.error('Error:', error)
              alert('Error verifying payment')
            }
          },
          modal: {
            ondismiss: function () {
              setIsPaying(false)
              setPayingInvoiceId(null)
            }
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)

      script.onerror = () => {
        setIsPaying(false)
        setPayingInvoiceId(null)
        alert('Failed to load payment processor')
      }
    } catch (error) {
      console.error('Error:', error)
      alert(error.message || 'Error creating payment order')
      setIsPaying(false)
      setPayingInvoiceId(null)
    }
  }

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-3 h-screen max-w-full overflow-hidden flex flex-col">
      {/* View Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto relative">
            <button
              onClick={() => setViewInvoice(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <img src="/invertio-logo-full.jpg" alt="full-logo" className="w-20 h-20" />
                <h3 className="font-bold text-gray-900 mb-2">Invertio Solutions</h3>
                <p className="text-sm text-gray-700">5 Penn Plaza, 14th Floor, New York, NY 10001, US</p>
                <p className="text-sm text-gray-700 mt-1">GSTIN: 36AAHCJ2304M1ZK</p>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">TAX INVOICE</h1>
                <div className="mt-2 text-sm text-black">
                  <p><span className="font-medium">Invoice #:</span> {viewInvoice.id}</p>
                  <p><span className="font-medium">Invoice Date:</span> {formatDate(viewInvoice.createdAt)}</p>
                  <p><span className="font-medium">Due Date:</span> {formatDate(viewInvoice.dueDate)}</p>
                  <p><span className="font-medium">Payment terms:</span> Immediate</p>
                  <p><span className="font-medium">Accepted Methods:</span> ACH & Fedwire</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Company and Bill To Section */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-gray-400 mb-2">Bill to:</h3>
                  <p className="text-sm text-black font-bold">{viewInvoice.customerName}</p>
                  <p className="text-sm text-gray-700">Customer ID: {viewInvoice.customerId}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-lg overflow-hidden mb-6 shadow-md">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-bold text-black border-b border-gray-200">Description</th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-black border-b border-gray-200">Return Type</th>
                      <th className="py-3 px-4 text-right text-sm font-bold text-black border-b border-gray-200">Amount (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{viewInvoice.returnName}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">{viewInvoice.returnType}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 text-right border-b border-gray-200">${viewInvoice.invoiceAmount.toFixed(2)}</td>
                    </tr>

                    {/* Total row */}
                    <tr className="bg-blue-100">
                      <td className="py-4 px-4 text-lg font-bold text-gray-900" colSpan={2}>Total (USD)</td>
                      <td className="py-4 px-4 text-lg font-bold text-gray-900 text-right">${viewInvoice.invoiceAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bank Details */}
              <h3 className="font-bold text-gray-400 mb-3">Bank details:</h3>

              <div className="bg-gray-100 border border-gray-200 text-black rounded-lg p-4 mb-6 flex gap-3">
                <div className="rounded-full w-20 h-16 flex justify-center items-center border border-gray-200 bg-white">
                  <p className="text-gray-700 font-bold"> <span className="text-red-700 font-bold">CF</span>SB</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p><span className="font-medium text-black">Payment method:</span> ACH or Fedwire</p>
                    <p><span className="font-medium text-black">Account number:</span> 8331054346</p>
                    <p><span className="font-medium text-black">ACH routing number:</span> 026073150</p>
                    <p><span className="font-medium text-black">Fedwire routing number:</span> 026073008</p>
                    <p><span className="font-medium text-black">Account type:</span> Business checking account</p>
                    <p><span className="font-medium text-black">Bank name:</span> Community Federal Savings Bank</p>
                    <p><span className="font-medium text-black">Beneficiary address:</span> 5 Penn Plaza, 14th Floor, New York, NY 10001, US</p>
                    <p><span className="font-medium text-black">Account holder name:</span> INVERTIO SOLUTIONS PRIVATE LIMITED</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="text-sm text-gray-700">
                <p className="font-medium">Notes</p>
                <p>Thank you for your continued trust in our services.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">

                <button
                  onClick={() => setViewInvoice(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {filteredInvoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className=""
        >
          {/* <h3 className="text-lg font-semibold text-gray-800 mb-2">Invoice Summary</h3> */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {statusOptions.slice(1).map((status, index, arr) => {
              const count = invoices.filter((a) => a.status === status.value).length;
              const total = invoices
                .filter((a) => a.status === status.value)
                .reduce((sum, invoice) => sum + invoice.invoiceAmount, 0);

              const statusIcons = {
                Paid: <CheckCircle className="h-5 w-5 text-green-500" />,
                Pending: <Clock className="h-5 w-5 text-amber-500" />,
                Overdue: <AlertCircle className="h-5 w-5 text-red-500" />,
                Draft: <FileText className="h-5 w-5 text-blue-500" />
              };

              const statusGradients = {
                Paid: "bg-gradient-to-r from-green-400 to-green-500",
                Pending: "bg-gradient-to-r from-amber-400 to-amber-500",
                Overdue: "bg-gradient-to-r from-red-400 to-red-500",
                Draft: "bg-gradient-to-r from-blue-400 to-blue-500"
              };

              const IconComponent =
                statusIcons[status.value] || <FileText className="h-5 w-5 text-gray-500" />;
              const gradientClass =
                statusGradients[status.value] ||
                "bg-gradient-to-r from-gray-400 to-gray-500";

              // Conditional radius
              const extraRadius =
                index === 0
                  ? "rounded-tl-2xl"
                  : index === arr.length - 1
                    ? "rounded-br-2xl"
                    : "";

              return (
                <motion.div
                  key={status.value}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`p-2 ${gradientClass} text-white shadow-md hover:shadow-lg border border-white border-opacity-20 transition-all ${extraRadius}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="p-1 rounded-lg bg-white bg-opacity-20">
                      {IconComponent}
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-20 text-black">
                      {count} {count === 1 ? "invoice" : "invoices"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">
                      {status.label}
                    </h3>
                    <div className="text-lg font-bold text-white">
                      ${total.toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-1 pt-1  border-white border-opacity-20">
                    <div className="text-xs text-white text-opacity-80">
                      {invoices.length > 0
                        ? Math.round((count / invoices.length) * 100)
                        : 0}
                      % of all invoices
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border p-1 mt-5"
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="w-full">
            <div className="flex items-center w-full gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search returns by ID, type, status, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filter Button */}
              <div className="px-4 py-3 bg-gray-200 p-1 rounded-md">
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center justify-center gap-1 text-black hover:text-gray-600"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline text-black">Filters</span>
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="pr-1 border-r-2 pl-2">
                <h1 className="text-gray-700 font-bold">Applied Filters</h1>
                {(searchTerm || filterStatus !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterStatus("all")
                    }}
                    className=" text-sm text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {filterStatus && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Status: {statusOptions.find(opt => opt.value === filterStatus)?.label}
                  <button
                    onClick={() => setFilterStatus('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    {/* <X className="w-3 h-3" /> */}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add more filter options here as needed */}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setFilterStatus('');
                    setIsFilterModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Invoices Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border overflow-hidden"
      >
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No invoices available."}
            </p>
          </div>
        ) : (
          <div className=""style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
            <div className="max-h-[300px] " style={{ overflow: 'scroll' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                      SN.NO
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                      Customer
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                      Return
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                      Amount
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                      Status
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                      Created
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                      Due Date
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRows.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-center align-middle">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center align-middle">
                        <div className="text-sm text-gray-900">{invoice.customerName}</div>
                        <div className="text-xs text-gray-500">ID: {invoice.customerId}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center align-middle">
                        <div>
                          <div className="text-sm text-gray-900">{invoice.returnName}</div>
                          <div className="text-sm text-gray-500">{invoice.returnType}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center align-middle">
                        <div className="text-sm font-medium text-gray-900">
                          ${invoice.invoiceAmount.toFixed(2)} USD
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center align-middle">
                        <span
                          className={`inline-flex justify-center items-center min-w-[120px] px-4 py-1 text-xs font-semibold rounded-lg ${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500 align-middle">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500 align-middle">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500 align-middle">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            disabled={isDownloading}
                            className="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                            title="Download Invoice"
                          >
                            {isDownloading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                          {invoice.status.toLowerCase() === "pending" ? (
                            <button
                              onClick={() => payNow(invoice)}
                              disabled={isPaying && payingInvoiceId === invoice.id}
                              className="text-purple-600 hover:text-purple-700 transition-colors disabled:opacity-50"
                              title="Pay Invoice"
                            >
                              {isPaying && payingInvoiceId === invoice.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                              ) : (
                                <CreditCard className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <div className="text-green-600" title="Payment Completed">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

            </div>

            <div className="flex justify-between items-center mt-4 p-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredInvoices.length)} of {filteredInvoices.length} results
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-[#3F058F] text-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className=" px-3 py-1 text-sm bg-[#3F058F] text-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 text-sm bg-[#3F058F] text-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}