'use client'

import Link from 'next/link'
import type { Tool } from '@/data/tools'
import { TOOLS } from '@/data/tools'

type Props = { tool: Tool }

const CATEGORY_CONFIG: Record<Tool['category'], { label: string; color: string }> = {
  runtime: { label: 'Runtime', color: '#3b82f6' },
  'ai-tool': { label: 'AI Tool', color: '#a855f7' },
  'package-manager': { label: 'Pkg Manager', color: '#f59e0b' },
}

export default function ToolCard({ tool }: Props) {
  const depNames = tool.dependencies.map(
    (depId) => TOOLS.find((t) => t.id === depId)?.name ?? depId
  )
  const cat = CATEGORY_CONFIG[tool.category]

  return (
    <Link
      href={`/install/${tool.id}`}
      className="group relative flex flex-col gap-4 p-5 transition-all duration-200"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-col)',
        outline: '1px solid transparent',
        outlineOffset: '-1px',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--accent)'
        el.style.background = 'var(--surface-2)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border-col)'
        el.style.background = 'var(--surface)'
      }}
    >
      {/* Top: category dot + label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: cat.color }}
          />
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: cat.color, fontFamily: 'var(--font-geist-mono)', opacity: 0.85 }}
          >
            {cat.label}
          </span>
        </div>
        {/* Arrow */}
        <span
          className="text-xs transition-transform duration-200 group-hover:translate-x-0.5"
          style={{ color: 'var(--muted)' }}
        >
          →
        </span>
      </div>

      {/* Name */}
      <div>
        <h2
          className="text-xl font-bold leading-tight transition-colors duration-200"
          style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}
        >
          {tool.name}
        </h2>
        {tool.lts && (
          <span
            className="text-xs font-mono mt-1 inline-block"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono)' }}
          >
            v{tool.lts.version} LTS
          </span>
        )}
      </div>

      {/* Description */}
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: 'var(--fg-dim)' }}
      >
        {tool.description}
      </p>

      {/* Dependencies */}
      {depNames.length > 0 && (
        <div
          className="flex items-center gap-1.5 text-xs font-mono pt-1 mt-auto"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)', borderTop: '1px solid var(--border-col)' }}
        >
          <span style={{ color: 'var(--accent)' }}>↳</span>
          <span>requires {depNames.join(', ')}</span>
        </div>
      )}

      {/* Accent left border on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-200 opacity-0 group-hover:opacity-100"
        style={{ background: 'var(--accent)' }}
      />
    </Link>
  )
}
