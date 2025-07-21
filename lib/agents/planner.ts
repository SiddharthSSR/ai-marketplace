'use server'

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import config from "@/lib/config"
import { tools } from "@/tools"

const openaiClient = createOpenAI({
  apiKey: config.openaiApiKey,
})

export interface PlannerOutput {
  logs: string[]
  finalResult: string
}

interface TaskPlan {
  subtask: string
  toolId: string
  description: string
}

const availableTools = {
  "text-generator": "Generate text, write content, create articles, blog posts, creative writing",
  "summary-generator": "Summarize text, articles, documents, create abstracts",
  "code-assistant": "Explain code, debug, write code, programming help",
  "image-analyzer": "Analyze images, describe visual content, extract text from images",
  "seo-analyzer": "SEO analysis, keyword research, content optimization",
  "data-processor": "Process data, analyze datasets, create reports",
  "chat-assistant": "General conversation, Q&A, helpful responses",
  "web-surfing-agent": "Scrape websites, get web content, extract data from URLs",
}

/**
 * AI-powered planner that intelligently breaks down complex tasks
 */
async function planTaskWithAI(userTask: string): Promise<TaskPlan[]> {
  const toolDescriptions = Object.entries(availableTools)
    .map(([id, desc]) => `- ${id}: ${desc}`)
    .join('\n')

  const prompt = `You are an intelligent task planner. Break down the user's task into logical subtasks and assign the most appropriate tool for each.

Available tools:
${toolDescriptions}

User task: "${userTask}"

Analyze the task and create a step-by-step plan. For each step, specify:
1. A clear subtask description
2. The most appropriate tool ID
3. A brief explanation of why this tool is needed

Respond in JSON format like this:
{
  "plan": [
    {
      "subtask": "Search for recent climate change articles",
      "toolId": "web-surfing-agent",
      "description": "Need to find and retrieve articles from the web"
    },
    {
      "subtask": "Summarize the collected articles",
      "toolId": "summary-generator", 
      "description": "Process the articles to create concise summaries"
    }
  ]
}

Important guidelines:
- Break complex tasks into logical steps
- Use web-surfing-agent for getting online content
- Use summary-generator for summarizing content
- Use text-generator for creating new content
- Keep subtasks focused and actionable
- Maximum 5 subtasks per plan`

  try {
    const { text } = await generateText({
      model: openaiClient("gpt-4o"),
      prompt,
      maxTokens: 1000,
    })

    // Parse the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not parse AI response")
    }

    const parsed = JSON.parse(jsonMatch[0])
    return parsed.plan || []
  } catch (error) {
    console.error("AI planning failed, falling back to rule-based:", error)
    return fallbackPlanTask(userTask)
  }
}

/**
 * Fallback rule-based planner (your original logic)
 */
function fallbackPlanTask(task: string): TaskPlan[] {
  const plans: TaskPlan[] = []
  const taskLower = task.toLowerCase()

  // Enhanced keyword matching with better logic
  if (taskLower.includes('get') && (taskLower.includes('article') || taskLower.includes('web') || taskLower.includes('scrape'))) {
    plans.push({
      subtask: "Scrape web content based on the request",
      toolId: "web-surfing-agent",
      description: "Retrieve content from websites"
    })
  }

  if (taskLower.includes('summarize') || taskLower.includes('summary')) {
    plans.push({
      subtask: "Summarize the content",
      toolId: "summary-generator", 
      description: "Create concise summary"
    })
  }

  if (taskLower.includes('generate') || taskLower.includes('write') || taskLower.includes('create')) {
    plans.push({
      subtask: "Generate text content",
      toolId: "text-generator",
      description: "Create new text content"
    })
  }

  if (taskLower.includes('code') || taskLower.includes('debug') || taskLower.includes('program')) {
    plans.push({
      subtask: "Assist with code",
      toolId: "code-assistant",
      description: "Help with programming tasks"
    })
  }

  if (taskLower.includes('image') || taskLower.includes('photo') || taskLower.includes('picture')) {
    plans.push({
      subtask: "Analyze image content",
      toolId: "image-analyzer",
      description: "Process and analyze images"
    })
  }

  if (taskLower.includes('seo') || taskLower.includes('optimize')) {
    plans.push({
      subtask: "Perform SEO analysis",
      toolId: "seo-analyzer",
      description: "Analyze and optimize for SEO"
    })
  }

  if (taskLower.includes('data') || taskLower.includes('analyze') || taskLower.includes('process')) {
    plans.push({
      subtask: "Process data",
      toolId: "data-processor",
      description: "Analyze and process data"
    })
  }

  // Default fallback
  if (plans.length === 0) {
    plans.push({
      subtask: task,
      toolId: "text-generator",
      description: "General text generation task"
    })
  }

  return plans
}

/**
 * Enhanced planner that runs tasks and passes context between them
 */
export async function runPlannerAgent(userTask: string): Promise<PlannerOutput> {
  const logs: string[] = [`🧠 Planner received task: "${userTask}"`]
  
  // Use AI planning first, fallback to rule-based if needed
  logs.push(`🤖 Analyzing task with AI...`)
  const plans = await planTaskWithAI(userTask)
  
  logs.push(`📋 Decomposed into ${plans.length} subtasks.`)
  
  let finalResult = ""
  let contextData = "" // Pass data between tasks
  
  for (const [index, plan] of plans.entries()) {
    logs.push(`\n🔧 Subtask ${index + 1}: ${plan.subtask}`)
    logs.push(`📝 Reasoning: ${plan.description}`)
    logs.push(`🛠️ Assigning to tool: ${plan.toolId}`)
    
    const toolFn = tools[plan.toolId]
    if (!toolFn || typeof toolFn.runTool !== "function") {
      logs.push(`❌ Tool not found or invalid: ${plan.toolId}`)
      continue
    }
    
    try {
      // Enhance subtask with context from previous steps
      let enhancedInput = plan.subtask
      if (contextData && index > 0) {
        enhancedInput = `${plan.subtask}\n\nContext from previous steps:\n${contextData}`
      }
      
      const result = await toolFn.runTool(enhancedInput)
      logs.push(`✅ Result: ${result.substring(0, 200)}${result.length > 200 ? '...' : ''}`)
      
      // Store result as context for next tasks
      contextData += `\nStep ${index + 1} result: ${result}`
      finalResult += `\n\n**Step ${index + 1}: ${plan.subtask}**\n${result}`
      
    } catch (error) {
      logs.push(`❌ Error from ${plan.toolId}: ${String(error)}`)
    }
  }
  
  return {
    logs,
    finalResult: finalResult.trim(),
  }
}