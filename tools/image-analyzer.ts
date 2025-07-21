import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
// import { config } from "dotenv"
// config()

const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function handleImageAnalyzer(input: string, imageFile?: File | null): Promise<string> {
  if (!imageFile) {
    return "Please upload an image to analyze."
  }

  const bytes = await imageFile.arrayBuffer()
  const base64 = Buffer.from(bytes).toString("base64")
  const mimeType = imageFile.type

  const { text } = await generateText({
    model: openaiClient("gpt-4o"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              input ||
              "Analyze this image in detail. Describe what you see, identify objects, text, and provide insights.",
          },
          {
            type: "image",
            image: `data:${mimeType};base64,${base64}`,
          },
        ],
      },
    ],
    maxTokens: 1000,
  })
  return text
}
