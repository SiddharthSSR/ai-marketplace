import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function handleCodeAssistant(input: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Write clean code and explain: ${input}`,
    maxTokens: 1000,
  })
  return text
}
