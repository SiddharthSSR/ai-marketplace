import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import config from "@/lib/config"

const openaiClient = createOpenAI({
  apiKey: config.openaiApiKey,
})

export async function handleSeoAnalyzer(input: string): Promise<string> {
  const { text } = await generateText({
    model: openaiClient("gpt-4o"),
    prompt: `You are an SEO expert. Analyze the following content and provide SEO improvements:\n\n${input}`,
    maxTokens: 600,
  })
  return text
}
