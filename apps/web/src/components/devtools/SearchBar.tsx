'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Icon from './Icon'
import { TOOLS } from '@/data/tools'
import type { Tool } from '@/data/tools'
import { DEVTOOLS_BASE, toolHref } from '@/lib/devtools-paths'

const CAT_CHIP: Record<Tool['category'], { label: string; bg: string; fg: string }> = {
  runtime:           { label: 'Runtime',     bg: 'var(--cat-runtime-bg)', fg: 'var(--cat-runtime-fg)' },
  'ai-tool':         { label: 'AI agent',    bg: 'var(--cat-ai-bg)',      fg: 'var(--cat-ai-fg)'      },
  'package-manager': { label: 'Pkg manager', bg: 'var(--cat-pkg-bg)',      fg: 'var(--cat-pkg-fg)'      },
  platform:          { label: 'Platform',    bg: 'var(--cat-platform-bg)', fg: 'var(--cat-platform-fg)' },
  vcs:               { label: 'VCS',         bg: 'var(--cat-vcs-bg)',      fg: 'var(--cat-vcs-fg)'      },
}

function filterTools(query: string): readonly Tool[] {
  const lower = query.toLowerCase()
  return TOOLS.filter(t => t.name.toLowerCase().includes(lower))
}

export default function SearchBar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)
  const [query, setQuery]             = useState('')
  const [open, setOpen]               = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

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
        if (window.location.pathname !== DEVTOOLS_BASE) {
          window.location.assign(DEVTOOLS_BASE)
          return
        }
        focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focus])


  function handleChange(next: string) {
    setQuery(next)
    setOpen(next.length > 0)
    setHighlighted(-1)
  }

  function navigate(tool: Tool) {
    window.location.assign(toolHref(tool.id))
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
    <div ref={containerRef} className="relative hidden md:block" style={{ minWidth: 200 }}>
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
          onBlur={() => { setOpen(false); setHighlighted(-1) }}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={highlighted >= 0 ? `suggestion-${highlighted}` : undefined}
          aria-label="Search tools"
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
          id="search-suggestions"
          role="listbox"
          aria-label="Tool suggestions"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
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
                  id={`suggestion-${i}`}
                  role="option"
                  aria-selected={i === highlighted}
                  type="button"
                  onMouseDown={e => e.preventDefault()}
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
