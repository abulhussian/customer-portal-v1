"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import ConfirmDialog from "./ConfirmDialog"
import {
  FileText,
  ImageIcon,
  File,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  MessageSquare,
  Calendar,
  HardDrive,
  ExternalLink,
} from "lucide-react"
import { formatDate } from "../utils/validators"

const DocumentList = ({ documents, onUpdate, onDelete }) => {
  const [previewDocument, setPreviewDocument] = useState(null)
  const [editingComment, setEditingComment] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-600" />
      case "docx":
        return <File className="w-6 h-6 text-blue-600" />
      case "image":
        return <ImageIcon className="w-6 h-6 text-green-600" />
      default:
        return <File className="w-6 h-6 text-gray-600" />
    }
  }

  const getFileTypeColor = (type) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800 border-red-200"
      case "docx":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "image":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size"
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDownload = (document) => {
    // Simulate file download
    const element = document.createElement("a")
    const file = new Blob([`Document: ${document.name}`], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = document.name
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handlePreview = (document) => {
    setPreviewDocument(document)
  }

  const handleEditComment = (document) => {
    setEditingComment(document.id)
    setCommentText(document.comments || "")
  }

  const handleSaveComment = (documentId) => {
    onUpdate(documentId, { comments: commentText })
    setEditingComment(null)
    setCommentText("")
  }

  const handleCancelComment = () => {
    setEditingComment(null)
    setCommentText("")
  }

  const handleDelete = (document) => {
    setDeleteConfirm(document)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500 text-center">No documents match your current search and filter criteria.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {documents.map((document) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getFileIcon(document.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate" title={document.name}>
                        {document.name}
                      </h3>
                      <p className="text-sm text-gray-500">{formatFileSize(document.size)}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreview(document)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(document)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditComment(document)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Edit Comment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(document)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getFileTypeColor(document.type)}>{document.type.toUpperCase()}</Badge>
                    {document.source && (
                      <Badge variant="outline" className="text-xs">
                        {document.source}
                        {document.returnType && ` (${document.returnType})`}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Uploaded: {formatDate(document.uploadDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      <span>{formatFileSize(document.size)}</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="pt-3 border-t border-gray-100">
                    {editingComment === document.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add comments about this document..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="min-h-[60px] resize-none text-sm"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveComment(document.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelComment}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500">Comments</span>
                        </div>
                        {document.comments ? (
                          <p className="text-sm text-gray-600 line-clamp-2">{document.comments}</p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No comments added</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handlePreview(document)} className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(document)} className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewDocument && getFileIcon(previewDocument.type)}
              {previewDocument?.name}
            </DialogTitle>
            <DialogDescription>
              {previewDocument && (
                <div className="flex items-center gap-4 text-sm">
                  <span>{formatFileSize(previewDocument.size)}</span>
                  <span>Uploaded {formatDate(previewDocument.uploadDate)}</span>
                  {previewDocument.source && <Badge variant="outline">{previewDocument.source}</Badge>}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {previewDocument?.type === "pdf" ? (
              <div className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">PDF Preview</p>
                    <p className="text-sm text-gray-500">
                      PDF preview would be displayed here using a PDF viewer library
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 bg-transparent"
                      onClick={() => handleDownload(previewDocument)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              </div>
            ) : previewDocument?.type === "image" ? (
              <div className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Image Preview</p>
                    <p className="text-sm text-gray-500">Image would be displayed here</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Document Preview</p>
                    <p className="text-sm text-gray-500">
                      Preview not available for this file type. Click download to view the file.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 bg-transparent"
                      onClick={() => handleDownload(previewDocument)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {previewDocument?.comments && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
              <p className="text-sm text-gray-600">{previewDocument.comments}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Document"
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
}

export default DocumentList
