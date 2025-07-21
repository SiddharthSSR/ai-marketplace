import { NextRequest, NextResponse } from "next/server"
import { tools } from "@/tools"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const goal = body.goal as string

  // === 🧠 Planner logic ===
  const subtasks = planSubtasks(goal)

  const results: string[] = []

  for (const task of subtasks) {
    const handler = tools[task.tool]
    if (!handler) {
      results.push(`❌ Unknown tool: ${task.tool}`)
      continue
    }
    const result = await handler.runTool(task.input)
    results.push(`✅ ${task.tool}: ${result}`)
  }

  return NextResponse.json({ result: results.join("\n\n") })
}

// Very basic planner logic (can improve later)
function planSubtasks(goal: string): { tool: string; input: string }[] {
  if (goal.includes("summarize")) {
    return [{ tool: "summary-generator", input: goal }]
  } else if (goal.includes("analyze image")) {
    return [{ tool: "image-analyzer", input: goal }]
  } else {
    return [{ tool: "text-generator", input: goal }]
  }
}