import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import config from "@/lib/config"

const openaiClient = createOpenAI({
  apiKey: config.openaiApiKey,
})

export async function handleCodeAssistant(input: string) {
  const { text } = await generateText({
    model: openaiClient("gpt-4o"),
    prompt: `Write clean code and explain: ${input}`,
    maxTokens: 1000,
  })
  return text
}
