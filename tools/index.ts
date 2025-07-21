import { handleTextGenerator } from "./text-generator"
import { handleCodeAssistant } from "./code-assistant"
import { handleImageAnalyzer } from "./image-analyzer"
import { handleDataProcessor } from "./data-processor"
import { handleWebSurfingAgent, surfWebForSpecificData } from "./web-scraper"
import { handleChatAssistant } from "./chat-assistant"
import { handleSummaryGenerator } from "./summary-generator"
import { handleSeoAnalyzer } from "./seo-analyzer"

// Define interfaces for better type safety
interface BasicTool {
  runTool: (input: string, image?: File | null) => Promise<string>
}

interface WebSurfingTool {
  runTool: (input: string, options?: {
    maxSites?: number
    searchDepth?: number
    focusAreas?: string[]
  }) => Promise<string>
}

interface SpecificDataTool {
  runTool: (input: string, dataPatterns: string[], options?: {
    maxSites?: number
    targetDomains?: string[]
    excludeDomains?: string[]
  }) => Promise<string>
}

// Wrapper functions to maintain consistent interface
const webSurfingWrapper = async (input: string, image?: File | null): Promise<string> => {
  try {
    const result = await handleWebSurfingAgent(input, {
      maxSites: 5,
      searchDepth: 2
    })
    
    // Format the result as a readable string
    let output = `🔍 Web Surfing Results for: "${result.query}"\n\n`
    output += `📊 Summary:\n${result.summary}\n\n`
    output += `🌐 Sources Analyzed (${result.totalSources}):\n\n`
    
    result.websites.forEach((site, index) => {
      output += `${index + 1}. **${site.title}** (Relevance: ${site.relevanceScore}/10)\n`
      output += `   URL: ${site.url}\n`
      output += `   Content: ${site.content}\n`
      if (site.keyData.keyPoints && site.keyData.keyPoints.length > 0) {
        output += `   Key Points: ${site.keyData.keyPoints.join(', ')}\n`
      }
      output += `\n`
    })
    
    return output
  } catch (error) {
    return `❌ Web surfing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
}

const specificDataWrapper = async (input: string, image?: File | null): Promise<string> => {
  try {
    // Parse input to extract query and data patterns
    // Expected format: "query | pattern1, pattern2, pattern3"
    const parts = input.split('|')
    const query = parts[0]?.trim() || input
    const dataPatterns = parts[1] ? parts[1].split(',').map(p => p.trim()) : ['statistics', 'data', 'numbers']
    
    const result = await surfWebForSpecificData(query, dataPatterns, {
      maxSites: 6
    })
    
    // Format the result focusing on specific data found
    let output = `📈 Specific Data Search Results for: "${result.query}"\n\n`
    output += `🎯 Target Data Patterns: ${dataPatterns.join(', ')}\n\n`
    output += `📊 Findings Summary:\n${result.summary}\n\n`
    output += `💡 Data Sources (${result.totalSources}):\n\n`
    
    result.websites.forEach((site, index) => {
      output += `${index + 1}. **${site.title}** (Relevance: ${site.relevanceScore}/10)\n`
      output += `   URL: ${site.url}\n`
      output += `   Key Data: ${site.content}\n\n`
    })
    
    return output
  } catch (error) {
    return `❌ Specific data search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
}

export const tools: Record<string, BasicTool> = {
  "text-generator": { runTool: handleTextGenerator },
  "code-assistant": { runTool: handleCodeAssistant },
  "image-analyzer": { runTool: handleImageAnalyzer },
  "data-processor": { runTool: handleDataProcessor },
  "web-surfing-agent": { runTool: webSurfingWrapper },
  "specific-data-scraper": { runTool: specificDataWrapper },
  "chat-assistant": { runTool: handleChatAssistant },
  "summary-generator": { runTool: handleSummaryGenerator },
  "seo-analyzer": { runTool: handleSeoAnalyzer },
}

// Export additional functions for direct use if needed
export {
  handleWebSurfingAgent,
  surfWebForSpecificData
}