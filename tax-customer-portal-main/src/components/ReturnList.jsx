"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import ConfirmDialog from "./ConfirmDialog"
import { FileText, MoreVertical, Edit, Trash2, Download, Calendar, FolderOpen, Search, Filter } from "lucide-react"
import { formatDate } from "../utils/validators"

const ReturnList = ({ returns, onEdit, onStatusChange, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("lastUpdated")
  const [sortOrder, setSortOrder] = useState("desc")
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳"
      case "In Review":
        return "👀"
      case "Completed":
        return "✅"
      default:
        return "📄"
    }
  }

  const filteredAndSortedReturns = returns
    .filter((returnItem) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        returnItem.type.toLowerCase().includes(searchLower) ||
        returnItem.status.toLowerCase().includes(searchLower) ||
        returnItem.id.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "createdDate" || sortBy === "lastUpdated") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleStatusChange = (returnId, newStatus) => {
    onStatusChange(returnId, newStatus)
  }

  const handleDelete = (returnItem) => {
    setDeleteConfirm(returnItem)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  const handleDownload = (returnItem) => {
    // Simulate file download
    const element = document.createElement("a")
    const file = new Blob([`Tax Return ${returnItem.type} - ${returnItem.id}`], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `tax-return-${returnItem.type}-${returnItem.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (returns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tax returns found</h3>
          <p className="text-gray-500 text-center mb-4">
            {searchTerm ? "No returns match your search criteria." : "Get started by creating your first tax return."}
          </p>
          {!searchTerm && (
            <Button onClick={() => onEdit(null)}>
              <FileText className="w-4 h-4 mr-2" />
              Create Tax Return
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search returns by type, status, or ID..."
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
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("lastUpdated")}>Last Updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("createdDate")}>Created Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("type")}>Return Type</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? "Descending" : "Ascending"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Returns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAndSortedReturns.map((returnItem) => (
          <motion.div
            key={returnItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Form {returnItem.type}</h3>
                      <p className="text-sm text-gray-500">ID: {returnItem.id}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(returnItem)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(returnItem)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleStatusChange(returnItem.id, "Pending")}>
                        Set to Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(returnItem.id, "In Review")}>
                        Set to In Review
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(returnItem.id, "Completed")}>
                        Set to Completed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(returnItem)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(returnItem.status)}>
                      <span className="mr-1">{getStatusIcon(returnItem.status)}</span>
                      {returnItem.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FolderOpen className="w-4 h-4" />
                      {returnItem.documentCount} docs
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {formatDate(returnItem.createdDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Updated: {formatDate(returnItem.lastUpdated)}</span>
                    </div>
                  </div>

                  {returnItem.notes && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-2">{returnItem.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Tax Return"
        description={`Are you sure you want to delete Form ${deleteConfirm?.type} (ID: ${deleteConfirm?.id})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

export default ReturnList
