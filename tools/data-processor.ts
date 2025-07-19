import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function handleDataProcessor(input: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Analyze and summarize the data: ${input}`,
    maxTokens: 1000,
  })
  return text
}
