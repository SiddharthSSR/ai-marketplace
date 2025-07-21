import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import config from "@/lib/config"

const openaiClient = createOpenAI({
  apiKey: config.openaiApiKey,
})

export async function handleDataProcessor(input: string) {
  const { text } = await generateText({
    model: openaiClient("gpt-4o"),
    prompt: `Analyze and summarize the data: ${input}`,
    maxTokens: 1000,
  })
  return text
}
