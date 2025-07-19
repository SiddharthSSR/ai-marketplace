import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function handleTextGenerator(input: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Write professional content based on: ${input}`,
    maxTokens: 1000,
  })
  return text
}
