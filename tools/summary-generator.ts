import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import config from "@/lib/config"

const openaiProvider = createOpenAI({
  apiKey: config.openaiApiKey
})

export async function handleSummaryGenerator(input: string): Promise<string> {
  const { text } = await generateText({
    model: openaiProvider("gpt-4o"),
    prompt: `You are a helpful assistant. Please summarize the following in a clear and concise way:\n\n${input}`,
    maxTokens: 500,
  })
  return text
}