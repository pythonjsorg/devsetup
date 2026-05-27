# Search Suggestions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace URL-driven grid filtering with an inline typeahead suggestions dropdown in SearchBar — clicking a suggestion navigates to `/install/[tool-id]`.

**Architecture:** SearchBar becomes self-contained: imports TOOLS directly, filters locally on keystroke, renders a floating dropdown. No URL state. FilterableGrid loses its `useSearchParams` dependency and filters only by category pill.

**Tech Stack:** Next.js 15.5.18, React 19, TypeScript 5 (strict mode), no test framework installed — verification via `tsc --noEmit` and dev server.

---

### Task 1: Rewrite SearchBar with suggestions dropdown

**Files:**
- Modify: `src/components/SearchBar.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import { TOOLS } from '@/data/tools'
import type { Tool } from '@/data/tools'

const CAT_CHIP: Record<Tool['category'], { label: string; bg: string; fg: string }> = {
  runtime:           { label: 'Runtime',     bg: 'var(--cat-runtime-bg)', fg: 'var(--cat-runtime-fg)' },
  'ai-tool':         { label: 'AI agent',    bg: 'var(--cat-ai-bg)',      fg: 'var(--cat-ai-fg)'      },
  'package-manager': { label: 'Pkg manager', bg: 'var(--cat-pkg-bg)',     fg: 'var(--cat-pkg-fg)'     },
}

function filterTools(query: string): readonly Tool[] {
  const lower = query.toLowerCase()
  return TOOLS.filter(
    t =>
      t.name.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower)
  )
}

export default function SearchBar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)
  const [query, setQuery]             = useState('')
  const [open, setOpen]               = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const router   = useRouter()
  const pathname = usePathname()

  const suggestions = open ? filterTools(query) : []

  const focus = useCallback(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  // ⌘K / Ctrl+K — focus from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (pathname !== '/') router.push('/')
        focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pathname, router, focus])

  // Close dropdown on outside click
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleChange(next: string) {
    setQuery(next)
    setOpen(next.length > 0)
    setHighlighted(-1)
  }

  function navigate(tool: Tool) {
    router.push(`/install/${tool.id}`)
    setQuery('')
    setOpen(false)
    setHighlighted(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setQuery('')
      setOpen(false)
      setHighlighted(-1)
      inputRef.current?.blur()
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      navigate(suggestions[highlighted])
    }
  }

  return (
    <div ref={containerRef} className="relative hidden md:block">
      {/* Input pill */}
      <div
        className="inline-flex items-center gap-2 whitespace-nowrap"
        style={{
          padding: '7px 14px 7px 12px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          fontSize: 13,
          color: 'var(--muted-foreground)',
          fontFamily: 'var(--font-jetbrains)',
          cursor: 'text',
        }}
        onClick={focus}
      >
        <Icon name="search" size={13} strokeWidth={2} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="search tools…"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--foreground)',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            width: query ? 120 : 88,
            minWidth: 0,
          }}
        />
        {!query && (
          <span
            className="ml-1.5"
            style={{
              fontSize: 10,
              border: '1px solid var(--border)',
              padding: '1px 5px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            ⌘K
          </span>
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Tool suggestions"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 260,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-2xl)',
            overflow: 'hidden',
            zIndex: 60,
          }}
        >
          {suggestions.length === 0 ? (
            <div
              style={{
                padding: '12px 16px',
                fontSize: 13,
                color: 'var(--muted-foreground)',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              No results
            </div>
          ) : (
            suggestions.map((tool, i) => {
              const chip = CAT_CHIP[tool.category]
              return (
                <button
                  key={tool.id}
                  role="option"
                  aria-selected={i === highlighted}
                  type="button"
                  onClick={() => navigate(tool)}
                  onMouseEnter={() => setHighlighted(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 16px',
                    background: i === highlighted ? 'var(--muted)' : 'transparent',
                    border: 'none',
                    borderBottom:
                      i < suggestions.length - 1
                        ? '1px solid var(--border-soft)'
                        : 'none',
                    cursor: 'pointer',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-geist)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--foreground)',
                    }}
                  >
                    {tool.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-jetbrains)',
                      color: chip.fg,
                      background: chip.bg,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chip.label}
                  </span>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: no errors

---

### Task 2: Clean up FilterableGrid

**Files:**
- Modify: `src/components/FilterableGrid.tsx`

- [ ] **Step 1: Replace the entire file**

Remove `useSearchParams`, `Suspense`, the `matches()` helper, and the `?q=` filter. Replace the entire file with:

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

Expected: no errors

---

### Task 3: Manual verification

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

Open: http://localhost:3000

- [ ] **Step 2: Verify suggestions dropdown**

1. Click the search bar in the header (or press ⌘K)
2. Type `node` → dropdown appears with "Node.js" showing a "Runtime" chip
3. Clear, type `bun` → "Bun" with "Runtime" chip
4. Clear, type `claude` → "Claude CLI" with "AI agent" chip
5. Clear, type `zzz` → dropdown shows "No results"
6. Clear input entirely → dropdown disappears

- [ ] **Step 3: Verify navigation**

1. Type `uv` → click "uv" suggestion → browser lands on `/install/uv`
2. Press back, type `codex` → press ↓ to highlight → press Enter → lands on `/install/codex-cli`

- [ ] **Step 4: Verify Escape and outside-click**

1. Type something → press Escape → input clears, dropdown closes
2. Type something → click anywhere else on the page → dropdown closes

- [ ] **Step 5: Verify category filter still works independently**

1. Click "Runtime" pill → grid shows only Node.js and Bun
2. Click "AI agent" → grid shows Claude CLI and Codex CLI
3. Click "All" → all 5 tools show again
4. While a category filter is active, type in the search bar → dropdown shows ALL matching tools regardless of active category (suggestions are not category-scoped)

- [ ] **Step 6: Verify grid no longer responds to search**

1. Type in the search bar → suggestions dropdown appears
2. The grid behind the dropdown remains unchanged — it does not filter as you type
