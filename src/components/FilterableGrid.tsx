'use client'

import { useState } from 'react'
import type { Tool } from '@/data/tools'
import ToolCard from '@/components/ToolCard'

type Category = Tool['category']

const FILTERS: { label: string; category: Category | null }[] = [
  { label: 'All',      category: null },
  { label: 'Runtime',  category: 'runtime' },
  { label: 'AI agent', category: 'ai-tool' },
  { label: 'Pkg mgr',  category: 'package-manager' },
]

export default function FilterableGrid({ tools }: { tools: readonly Tool[] }) {
  const [active, setActive] = useState<Category | null>(null)

  const visible = tools.filter(t => active === null || t.category === active)

  return (
    <>
      {/* ── Filter bar ───────────────────────────────────────── */}
      <div
        id="tools"
        className="mx-auto w-full max-w-7xl px-6 pt-8 pb-4 flex items-baseline gap-3.5 flex-wrap"
      >
        <h2
          style={{
            fontFamily: 'var(--font-geist)',
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            margin: 0,
            color: 'var(--foreground)',
          }}
        >
          The{' '}
          <em
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--primary)',
            }}
          >
            collection
          </em>
        </h2>
        <span
          style={{
            fontSize: 13,
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-jetbrains)',
          }}
        >
          — {visible.length} {visible.length === 1 ? 'recipe' : 'recipes'}, all maintained
        </span>

        <div className="flex-1" />

        <div
          className="inline-flex gap-1"
          style={{
            background: 'var(--muted)',
            borderRadius: 'var(--radius-full)',
            padding: 4,
          }}
        >
          {FILTERS.map(f => {
            const isActive = f.category === active
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setActive(f.category)}
                className="whitespace-nowrap"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--card)' : 'transparent',
                  color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tool grid ────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-16">
        {visible.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '48px 0',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 14,
            }}
          >
            No tools match.
          </div>
        )}
      </section>
    </>
  )
}
