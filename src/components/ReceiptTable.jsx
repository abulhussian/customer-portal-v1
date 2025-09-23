"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Search, Download, ReceiptIcon } from "lucide-react"
import { formatCurrency, formatDate } from "../utils/validators"

const ReceiptTable = ({ receipts }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("paidOn")
  const [sortOrder, setSortOrder] = useState("desc")

  const filteredAndSortedReceipts = receipts
    .filter((receipt) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        receipt.id.toLowerCase().includes(searchLower) ||
        receipt.invoiceId.toLowerCase().includes(searchLower) ||
        receipt.description?.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "paidOn") {
        aValue = new Date(a.paidOn)
        bValue = new Date(b.paidOn)
      } else if (sortBy === "amount") {
        aValue = a.amount
        bValue = b.amount
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleDownloadReceipt = (receipt) => {
    const invoice = {
      id: receipt.invoiceId,
      description: receipt.description || "Tax Service Payment",
      amount: receipt.amount,
    }

    const paymentDetails = {
      method: receipt.paymentMethod,
      date: receipt.paidOn,
    }

    // const doc = generateReceiptPDF(invoice, paymentDetails)

    // Add receipt-specific information
    doc.setFontSize(12)
    doc.text(`Receipt ID: ${receipt.id}`, 20, 110)

    // downloadPDF(doc, `receipt-${receipt.id}.pdf`)
  }

  const handleExportCSV = () => {
    const exportData = filteredAndSortedReceipts.map((receipt) => ({
      "Receipt ID": receipt.id,
      "Invoice ID": receipt.invoiceId,
      Amount: receipt.amount,
      "Paid On": formatDate(receipt.paidOn),
      "Payment Method": receipt.paymentMethod,
      Description: receipt.description || "N/A",
    }))

    // downloadCSV(exportData, `receipts-${new Date().toISOString().split("T")[0]}.csv`)
  }

  if (receipts.length === 0) {
    return (
      <div className="text-center py-12">
        <ReceiptIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
        <p className="text-gray-500">Receipts will appear here after successful payments.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Export Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search receipts by ID or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Receipt Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortBy("id")
                  setSortOrder(sortBy === "id" && sortOrder === "asc" ? "desc" : "asc")
                }}
              >
                Receipt ID
              </TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortBy("amount")
                  setSortOrder(sortBy === "amount" && sortOrder === "asc" ? "desc" : "asc")
                }}
              >
                Amount
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortBy("paidOn")
                  setSortOrder(sortBy === "paidOn" && sortOrder === "asc" ? "desc" : "asc")
                }}
              >
                Paid On
              </TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedReceipts.map((receipt) => (
              <motion.tr
                key={receipt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                className="transition-colors"
              >
                <TableCell className="font-medium">{receipt.id}</TableCell>
                <TableCell>
                  <Badge variant="outline">{receipt.invoiceId}</Badge>
                </TableCell>
                <TableCell className="font-medium text-green-600">{formatCurrency(receipt.amount)}</TableCell>
                <TableCell>{formatDate(receipt.paidOn)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{receipt.paymentMethod}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => handleDownloadReceipt(receipt)}>
                    <Download className="w-4 h-4 mr-1" />
                    Download PDF
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedReceipts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No receipts match your search criteria.</p>
        </div>
      )}
    </div>
  )
}

export default ReceiptTable
