"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import ConfirmDialog from "./ConfirmDialog"
import { Search, Filter, Download, MoreVertical, CreditCard, Trash2, FileText } from "lucide-react"
import { formatCurrency, formatDate } from "../utils/validators"

const InvoiceTable = ({ invoices, onPay, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "Unpaid":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredAndSortedInvoices = invoices
    .filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "date") {
        aValue = new Date(a.date)
        bValue = new Date(b.date)
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

  const handleExportCSV = () => {
    const exportData = filteredAndSortedInvoices.map((invoice) => ({
      "Invoice ID": invoice.id,
      Date: formatDate(invoice.date),
      Description: invoice.description,
      Amount: invoice.amount,
      Status: invoice.status,
      "Payment Method": invoice.paymentMethod || "N/A",
      "Paid Date": invoice.paidDate ? formatDate(invoice.paidDate) : "N/A",
    }))

    // downloadCSV(exportData, `invoices-${new Date().toISOString().split("T")[0]}.csv`)
  }

  const handleExportPDF = () => {
    // const doc = generateReceiptPDF(
    //   { id: "INVOICE_REPORT", description: "Invoice Report", amount: 0 },
    //   { method: "Report Generation" },
    // )

    // Add invoice data to PDF
    let yPosition = 140
    doc.setFontSize(14)
    doc.text("Invoice Report", 20, yPosition)
    yPosition += 20

    doc.setFontSize(10)
    filteredAndSortedInvoices.forEach((invoice) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }
      doc.text(
        `${invoice.id} - ${invoice.description} - ${formatCurrency(invoice.amount)} - ${invoice.status}`,
        20,
        yPosition,
      )
      yPosition += 15
    })

    // downloadPDF(doc, `invoice-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const handleDelete = (invoice) => {
    setDeleteConfirm(invoice)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
        <p className="text-gray-500">No invoices have been generated yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search invoices by ID or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Invoices</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("unpaid")}>Unpaid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Paid</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Invoice Table */}
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
                Invoice ID
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortBy("date")
                  setSortOrder(sortBy === "date" && sortOrder === "asc" ? "desc" : "asc")
                }}
              >
                Date
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSortBy("amount")
                  setSortOrder(sortBy === "amount" && sortOrder === "asc" ? "desc" : "asc")
                }}
              >
                Amount
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedInvoices.map((invoice) => (
              <motion.tr
                key={invoice.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                className="transition-colors"
              >
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell className="max-w-xs truncate" title={invoice.description}>
                  {invoice.description}
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                </TableCell>
                <TableCell>{invoice.paymentMethod || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {invoice.status === "Unpaid" && (
                      <Button size="sm" onClick={() => onPay(invoice)}>
                        <CreditCard className="w-4 h-4 mr-1" />
                        Pay
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {invoice.status === "Unpaid" && (
                          <DropdownMenuItem onClick={() => onPay(invoice)}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay Invoice
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(invoice)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedInvoices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No invoices match your search criteria.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice ${deleteConfirm?.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

export default InvoiceTable
