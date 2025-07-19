import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function handleSummaryGenerator(input: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Summarize the following text in a clear and concise way:\n\n${input}`,
    maxTokens: 500,
  })
  return text
}
