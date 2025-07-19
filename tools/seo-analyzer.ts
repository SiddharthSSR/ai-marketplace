import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function handleSeoAnalyzer(input: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `You are an SEO expert. Analyze the following content and provide SEO improvements:\n\n${input}`,
    maxTokens: 600,
  })
  return text
}
