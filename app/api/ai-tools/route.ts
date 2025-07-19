import { type NextRequest, NextResponse } from "next/server"
import { tools } from "@/tools"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const toolId = formData.get("toolId") as keyof typeof tools
    const input = formData.get("input") as string
    const image = formData.get("image") as File | null

    const tool = tools[toolId]

    if (!tool || typeof tool.runTool !== "function") {
      return NextResponse.json({ error: "Unknown tool" }, { status: 400 })
    }

    const result = await tool.runTool(input, image)
    return NextResponse.json({ result })
  } catch (error) {
    console.error("Tool execution error:", error)
    return NextResponse.json({ error: "Failed to run tool" }, { status: 500 })
  }
}
