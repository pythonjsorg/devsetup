import Link from 'next/link'
import type { Tool } from '@/data/tools'
import { TOOLS } from '@/data/tools'

type Props = { tool: Tool }

const CATEGORY_STYLES: Record<Tool['category'], string> = {
  runtime: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/30',
  'ai-tool': 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-950/40 dark:text-violet-400 dark:ring-violet-500/30',
  'package-manager': 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/30',
}

const CATEGORY_LABELS: Record<Tool['category'], string> = {
  runtime: 'Runtime',
  'ai-tool': 'AI Tool',
  'package-manager': 'Package Manager',
}

export default function ToolCard({ tool }: Props) {
  const depNames = tool.dependencies.map(
    (depId) => TOOLS.find((t) => t.id === depId)?.name ?? depId
  )

  return (
    <Link
      href={`/install/${tool.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/60"
    >
      {/* Header: name + category badge */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
          {tool.name}
        </h2>
        <span
          className={[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
            CATEGORY_STYLES[tool.category],
          ].join(' ')}
        >
          {CATEGORY_LABELS[tool.category]}
        </span>
      </div>

      {/* Description */}
      <p className="flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {tool.description}
      </p>

      {/* Dependencies chip */}
      {depNames.length > 0 && (
        <div className="mt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <span className="text-zinc-400 dark:text-zinc-500">Requires:</span>
            {depNames.join(', ')}
          </span>
        </div>
      )}
    </Link>
  )
}
