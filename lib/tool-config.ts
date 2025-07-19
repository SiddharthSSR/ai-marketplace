import toolsJson from "@/config/tools.json"
import * as Icons from "lucide-react"
import { ComponentType } from "react"

export type RawTool = (typeof toolsJson)[number]

export type Tool = RawTool & {
  iconComponent: ComponentType<{ className?: string }>
}

function mapIcons(tools: RawTool[]): Tool[] {
  return tools.map((tool) => {
    const icon = Icons[tool.icon as keyof typeof Icons]

    if (!icon) {
      console.warn(`⚠️ Icon "${tool.icon}" is invalid or missing in lucide-react. Using fallback.`)
    }

    const iconComponent = icon || Icons.FileText

    // console.log(`✅ Rendering icon for: ${tool.name}`, iconComponent)

    return {
      ...tool,
      iconComponent: iconComponent as ComponentType<{ className?: string }>
    }
  })
}

const mappedTools: Tool[] = mapIcons(toolsJson)

export function getAllTools(): Tool[] {
  return mappedTools
}

export function getToolById(id: string): Tool | undefined {
  return mappedTools.find((tool) => tool.id === id)
}

export function getUniqueCategories(): string[] {
  return ["All", ...Array.from(new Set(mappedTools.map((t) => t.category)))]
}