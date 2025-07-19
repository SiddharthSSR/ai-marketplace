"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Send, X } from "lucide-react"
import { MarkdownOutput } from "@/components/MarkdownOutput"
import ToolWindow from "@/components/ToolWindow"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: any
  color: string
  features: string[]
  pricing: string
}

interface ToolModalProps {
  tool: Tool
  isOpen: boolean
  onClose: () => void
}

export function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [input, setInput] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!input.trim() && !imageFile) return

    setIsLoading(true)
    setResult("")

    try {
      const formData = new FormData()
      formData.append("toolId", tool.id)
      formData.append("input", input)
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await fetch("/api/ai-tools", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process request")
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      setResult("Error: Failed to process your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const renderInputSection = () => {
    switch (tool.id) {
      case "image-analyzer":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Instructions (Optional)</label>
              <textarea
                placeholder="What would you like to know about this image?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>
        )
      case "web-scraper":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        )
      case "data-processor":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data to Process</label>
            <textarea
              placeholder="Paste your data here (CSV, JSON, or plain text)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        )
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Request</label>
            <textarea
              placeholder={`Enter your ${tool.name.toLowerCase()} request...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        )
    }
  }

  return (
    <ToolWindow title={tool.name} onClose={onClose}>
      <div className="p-6 h-full overflow-y-hidden"> {/* Removed overflow-y-auto from main div */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Input</h3>
            {renderInputSection()}

            <button
              onClick={handleSubmit}
              disabled={isLoading || (!input.trim() && !imageFile)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Run Tool
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Output</h3>
            <div className="min-h-[300px] border border-gray-300 rounded-lg p-4 bg-white flex items-start">
              {isLoading ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : result ? (
                <div className="prose prose-slate prose-sm dark:prose-invert max-w-none w-full break-words">
                  <MarkdownOutput content={result} />
                </div>
              ) : (
                <div className="text-gray-500 text-center w-full">
                  Results will appear here after processing
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tool Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">About {tool.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
          <div className="flex flex-wrap gap-2">
            {tool.features.map((feature, index) => (
              <span key={index} className="text-xs bg-white px-2 py-1 rounded border border-gray-300">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ToolWindow>
  )
}