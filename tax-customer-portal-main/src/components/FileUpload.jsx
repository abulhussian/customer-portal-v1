"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Upload, File } from "lucide-react"

const FileUpload = ({ onFileUpload, multiple = true, accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" }) => {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files) // ✅ convert FileList to array
    if (files.length > 0) {
      onFileUpload(files)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files) // ✅ convert FileList to array
    if (files.length > 0) {
      onFileUpload(files)
    }
    e.target.value = "" // reset to allow re-uploading same file
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">{dragOver ? "Drop files here" : "Upload Documents"}</p>
            <p className="text-sm text-gray-500 mt-1">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">Supports PDF, Word documents, and images (max 10MB each)</p>
          </div>

          <Button type="button" variant="outline" className="bg-transparent">
            <File className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default FileUpload
