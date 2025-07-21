import { generateText, generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import config from "@/lib/config"
import * as cheerio from 'cheerio'
import { z } from 'zod'

const openaiClient = createOpenAI({
  apiKey: config.openaiApiKey,
})

interface ScrapedResult {
  url: string
  title: string
  content: string
  relevanceScore: number
  keyData: Record<string, any>
}

interface WebSurfingResult {
  query: string
  websites: ScrapedResult[]
  summary: string
  totalSources: number
}

// Schema for search query generation
const SearchQueriesSchema = z.object({
  queries: z.array(z.string()).min(1).max(5),
  reasoning: z.string()
})

// Schema for data extraction
const ExtractedDataSchema = z.object({
  keyPoints: z.array(z.string()),
  relevanceScore: z.number().min(0).max(10),
  category: z.string(),
  summary: z.string()
})

export async function handleWebSurfingAgent(input: string, options?: {
  maxSites?: number
  searchDepth?: number
  focusAreas?: string[]
}): Promise<WebSurfingResult> {
  const maxSites = options?.maxSites || 5
  const searchDepth = options?.searchDepth || 2
  const focusAreas = options?.focusAreas || []
  
  try {
    console.log(`🔍 Starting web surfing for: "${input}"`)
    
    // Step 1: Generate intelligent search queries
    const searchQueries = await generateSearchQueries(input, focusAreas)
    console.log(`📝 Generated ${searchQueries.queries.length} search queries`)
    
    // Step 2: Search and collect URLs from multiple sources
    const allUrls = new Set<string>()
    
    for (const query of searchQueries.queries) {
      const urls = await searchWeb(query)
      urls.forEach(url => allUrls.add(url))
      
      // Add delay to respect rate limits
      await delay(1000)
    }
    
    console.log(`🌐 Found ${allUrls.size} unique URLs to explore`)
    
    // Step 3: Scrape and analyze each website
    const scrapedResults: ScrapedResult[] = []
    const urlsArray = Array.from(allUrls).slice(0, maxSites)
    
    for (const url of urlsArray) {
      try {
        console.log(`🔄 Scraping: ${url}`)
        const result = await scrapeAndAnalyzeWebsite(url, input)
        
        if (result && result.relevanceScore > 3) { // Only keep relevant results
          scrapedResults.push(result)
        }
        
        // Add delay between requests
        await delay(2000)
      } catch (error) {
        console.warn(`⚠️ Failed to scrape ${url}:`, error)
      }
    }
    
    // Step 4: Generate comprehensive summary
    const summary = await generateComprehensiveSummary(input, scrapedResults)
    
    console.log(`✅ Web surfing complete! Analyzed ${scrapedResults.length} relevant sources`)
    
    return {
      query: input,
      websites: scrapedResults.sort((a, b) => b.relevanceScore - a.relevanceScore),
      summary,
      totalSources: scrapedResults.length
    }
    
  } catch (error) {
    throw new Error(`Web surfing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function generateSearchQueries(input: string, focusAreas: string[]): Promise<{ queries: string[]; reasoning: string }> {
  const { object } = await generateObject({
    model: openaiClient("gpt-4o-mini"),
    schema: SearchQueriesSchema,
    maxTokens: 5000,
    prompt: `Generate 3-5 diverse search queries to comprehensively research this topic: "${input}"

${focusAreas.length > 0 ? `Focus on these specific areas: ${focusAreas.join(', ')}` : ''}

Create queries that will help find:
1. General information and overview
2. Recent news/updates
3. Expert opinions/analysis
4. Statistical data/research
5. Different perspectives/viewpoints

Each query should be specific enough to find quality sources but broad enough to capture comprehensive information.`
  })
  
  return object
}

async function searchWeb(query: string): Promise<string[]> {
  try {
    // Using a web search API (replace with your preferred search service)
    // This is a placeholder - you'll need to integrate with Google Search API, Bing API, or SerpAPI
    
    // For demo purposes, using DuckDuckGo instant answers API
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    
    const response = await fetch(searchUrl)
    const data = await response.json()
    
    // Extract URLs from search results
    const urls: string[] = []
    
    // Add related topics URLs if available
    if (data.RelatedTopics) {
      data.RelatedTopics.forEach((topic: any) => {
        if (topic.FirstURL) {
          urls.push(topic.FirstURL)
        }
      })
    }
    
    // Fallback: generate some common domains to search for the topic
    const fallbackDomains = [
      `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
      `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
      `https://news.google.com/search?q=${encodeURIComponent(query)}`
    ]
    
    return urls.length > 0 ? urls.slice(0, 3) : fallbackDomains
    
  } catch (error) {
    console.warn('Search failed, using fallback URLs')
    return [
      `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
      `https://www.google.com/search?q=${encodeURIComponent(query)}`
    ]
  }
}

async function scrapeAndAnalyzeWebsite(url: string, originalQuery: string): Promise<ScrapedResult | null> {
  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    }, 10000)
    
    if (!response.ok) {
      return null
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Remove unwanted elements
    $('script, style, nav, footer, aside, .advertisement, .ads').remove()
    
    // Extract basic information
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'No title found'
    
    // Extract main content
    let content = ''
    const contentSelectors = ['main', 'article', '[role="main"]', '.content', '#content', '.post', '.entry']
    
    for (const selector of contentSelectors) {
      const element = $(selector)
      if (element.length > 0 && element.text().length > 200) {
        content = element.text().trim()
        break
      }
    }
    
    if (!content) {
      content = $('body').text().trim()
    }
    
    // Clean content
    content = content.replace(/\s+/g, ' ').slice(0, 3000) // Limit content length
    
    if (content.length < 100) {
      return null // Skip pages with insufficient content
    }
    
    // Use AI to analyze relevance and extract key data
    const { object: analysis } = await generateObject({
      model: openaiClient("gpt-4o-mini"),
      schema: ExtractedDataSchema,
      prompt: `Analyze this web content for relevance to the query: "${originalQuery}"
      
URL: ${url}
Title: ${title}
Content: ${content}

Extract key information that's relevant to the original query. Rate relevance from 0-10 (0 = not relevant, 10 = highly relevant).
Provide a summary and list the most important points.`
    })
    
    return {
      url,
      title,
      content: analysis.summary,
      relevanceScore: analysis.relevanceScore,
      keyData: {
        category: analysis.category,
        keyPoints: analysis.keyPoints
      }
    }
    
  } catch (error) {
    console.warn(`Failed to scrape ${url}:`, error)
    return null
  }
}

async function generateComprehensiveSummary(query: string, results: ScrapedResult[]): Promise<string> {
  const sourcesData = results.map(r => ({
    url: r.url,
    title: r.title,
    content: r.content,
    keyPoints: r.keyData.keyPoints
  }))
  
  const { text } = await generateText({
    model: openaiClient("gpt-4o-mini"),
    prompt: `Create a comprehensive summary based on information gathered from ${results.length} web sources about: "${query}"

Sources analyzed:
${sourcesData.map((s, i) => `
${i + 1}. ${s.title} (${s.url})
Summary: ${s.content}
Key Points: ${s.keyPoints.join(', ')}
`).join('\n')}

Please provide:
1. A comprehensive overview of the topic
2. Key findings and insights
3. Different perspectives or viewpoints found
4. Any recent developments or trends
5. Credible sources and their main contributions

Format the response in a clear, structured manner that synthesizes information from all sources while noting any conflicting information.`,
    maxTokens: 5000
  })
  
  return text
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Helper function for fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`)
    }
    throw error
  }
}

// Enhanced version with specific data extraction patterns
export async function surfWebForSpecificData(
  query: string, 
  dataPatterns: string[],
  options?: {
    maxSites?: number
    targetDomains?: string[]
    excludeDomains?: string[]
  }
): Promise<WebSurfingResult> {
  
  const focusAreas = [
    `Find specific data about: ${dataPatterns.join(', ')}`,
    'Look for statistics, numbers, and quantitative data',
    'Search for recent research and studies'
  ]
  
  return handleWebSurfingAgent(query, {
    ...options,
    focusAreas
  })
}