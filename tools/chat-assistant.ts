import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function handleChatAssistant(input: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Respond like a friendly assistant to: ${input}`,
    maxTokens: 1000,
  })
  return text
}
