import { handleTextGenerator } from "./text-generator"
import { handleCodeAssistant } from "./code-assistant"
import { handleImageAnalyzer } from "./image-analyzer"
import { handleDataProcessor } from "./data-processor"
import { handleWebScraper } from "./web-scraper"
import { handleChatAssistant } from "./chat-assistant"
import { handleSummaryGenerator } from "./summary-generator"
import { handleSeoAnalyzer } from "./seo-analyzer"

export const tools: Record<
  string, { runTool: (input: string, image?: File | null) => Promise<string> } > = {
  "text-generator": { runTool: handleTextGenerator },
  "code-assistant": { runTool: handleCodeAssistant },
  "image-analyzer": { runTool: handleImageAnalyzer },
  "data-processor": { runTool: handleDataProcessor },
  "web-scraper": { runTool: handleWebScraper },
  "chat-assistant": { runTool: handleChatAssistant },
  "summary-generator": { runTool: handleSummaryGenerator },
  "seo-analyzer": { runTool: handleSeoAnalyzer },
}