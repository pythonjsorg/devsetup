import { TOOLS } from '@/data/tools'
import type { Tool } from '@/data/tools'

export function getAllTools(): readonly Tool[] {
  return TOOLS
}

export function getTool(id: string): Tool {
  const tool = TOOLS.find(t => t.id === id)
  if (!tool) throw new Error(`Tool not found: ${id}`)
  return tool
}

// Returns: [dep1, dep2, ..., tool] — deps first, tool last
// Deps are one level deep for all v1 tools (no recursive resolution needed)
export function resolveDeps(toolId: string): Tool[] {
  const tool = getTool(toolId)
  const deps = tool.dependencies.map(id => getTool(id))
  return [...deps, tool]
}
