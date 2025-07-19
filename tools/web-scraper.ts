import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function handleWebScraper(input: string) {
  try {
    const url = new URL(input)
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze and explain what can be scraped from this site: ${input}`,
      maxTokens: 1000,
    })
    return text
  } catch (err) {
    return "Please provide a valid URL."
  }
}
