"use client"

import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { ToolModal } from "@/components/tool-modal"
import ToolWindow from "@/components/ToolWindow"
import { getAllTools, getUniqueCategories } from "@/lib/tool-config"

const aiTools = getAllTools()
const categories = getUniqueCategories()

export default function AIMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTool, setSelectedTool] = useState<typeof aiTools[0] | null>(null)

  const filteredTools = aiTools.filter((tool) => {
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Marketplace</h1>
            </div>
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {aiTools.length} AI Tools Available
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Powerful AI Tools</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access cutting-edge AI capabilities through our curated marketplace of intelligent tools.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = tool.iconComponent
            return (
              <div
                key={tool.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${tool.color} text-white`}>
                      <IconComponent className="h-6 w-6 stroke-current" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{tool.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tool.features.map((feature, index) => (
                          <span
                            key={index}
                            className="border border-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">{tool.pricing}</span>
                      <button
                        onClick={() => setSelectedTool(tool)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Try Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tools found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolWindow title={selectedTool.name} onClose={() => setSelectedTool(null)}>
          <ToolModal tool={selectedTool} isOpen={!!selectedTool} onClose={() => setSelectedTool(null)} />
        </ToolWindow>
      )}
    </div>
  )
}