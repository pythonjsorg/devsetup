'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import { TOOLS } from '@/data/tools'
import type { Tool } from '@/data/tools'
import type { IconName } from '@/components/Icon'

// Mirror SearchBar's category labels; add an icon per category for result rows.
const CAT_CHIP: Record<Tool['category'], { label: string; bg: string; fg: string; icon: IconName }> = {
  runtime:           { label: 'Runtime',     bg: 'var(--cat-runtime-bg)',  fg: 'var(--cat-runtime-fg)',  icon: 'bolt'       },
  'ai-tool':         { label: 'AI agent',    bg: 'var(--cat-ai-bg)',       fg: 'var(--cat-ai-fg)',       icon: 'sparkles'   },
  'package-manager': { label: 'Pkg manager', bg: 'var(--cat-pkg-bg)',      fg: 'var(--cat-pkg-fg)',      icon: 'package'    },
  platform:          { label: 'Platform',    bg: 'var(--cat-platform-bg)', fg: 'var(--cat-platform-fg)', icon: 'layers'     },
  vcs:               { label: 'VCS',         bg: 'var(--cat-vcs-bg)',      fg: 'var(--cat-vcs-fg)',      icon: 'git-branch' },
}

function filterTools(query: string): readonly Tool[] {
  const lower = query.trim().toLowerCase()
  if (!lower) return TOOLS
  return TOOLS.filter(t => t.name.toLowerCase().includes(lower))
}

export default function MobileSearch() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [render, setRender] = useState(false)
  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()

  const results = filterTools(query)
  const searching = query.trim().length > 0

  useEffect(() => { setMounted(true) }, [])

  // enter / exit animation
  useEffect(() => {
    let frame = 0
    let timeout = 0
    if (open) {
      setRender(true)
      frame = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }
    setVisible(false)
    timeout = window.setTimeout(() => setRender(false), 240)
    return () => window.clearTimeout(timeout)
  }, [open])

  // scroll-lock while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // focus input on open; restore focus to the trigger on close
  useEffect(() => {
    if (visible) {
      inputRef.current?.focus()
      wasOpenRef.current = true
      return
    }
    if (!open && wasOpenRef.current) {
      triggerRef.current?.focus()
      wasOpenRef.current = false
    }
  }, [visible, open])

  // close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // reset query once the popup has finished closing
  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => { setQuery(''); setHighlighted(0) }, 240)
      return () => window.clearTimeout(t)
    }
  }, [open])

  // reset highlight to the top whenever the query changes
  useEffect(() => { setHighlighted(0) }, [query])

  // keep the highlighted row scrolled into view during keyboard nav
  useEffect(() => {
    if (!visible) return
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${highlighted}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [highlighted, visible])

  function go(tool: Tool) {
    router.push(`/tools/${tool.id}`)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => (results.length ? (h + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => (results.length ? (h - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const tool = results[highlighted]
      if (tool) go(tool)
    } else if (e.key === 'Tab' && panelRef.current) {
      // trap focus within the popup
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const popup = (
    <>
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'color-mix(in srgb, var(--foreground) 42%, transparent)',
          backdropFilter: 'blur(8px) saturate(0.95)',
          WebkitBackdropFilter: 'blur(8px) saturate(0.95)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 240ms cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* ── Command palette ──────────────────────────────────── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
        onKeyDown={onKeyDown}
        style={{
          position: 'fixed',
          top: 'max(7vh, env(safe-area-inset-top))',
          left: '50%',
          zIndex: 110,
          width: 'min(92vw, 560px)',
          maxHeight: 'min(72vh, 560px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-2xl)',
          overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translate(-50%, 0) scale(1)'
            : 'translate(-50%, -10px) scale(0.97)',
          transformOrigin: 'top center',
          transition:
            'opacity 220ms ease-out, transform 280ms cubic-bezier(0.16,1,0.3,1)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Input row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 16px',
          borderBottom: '1px solid var(--border-soft)',
          background: 'var(--card)',
          flexShrink: 0,
        }}>
          <span style={{ color: 'var(--muted-foreground)', display: 'flex', flexShrink: 0 }}>
            <Icon name="search" size={18} strokeWidth={2} />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="mobile-search-list"
            aria-activedescendant={results[highlighted] ? `ms-opt-${results[highlighted].id}` : undefined}
            aria-label="Search tools"
            placeholder="Search tools…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--foreground)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 16,
            }}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close search"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: 34,
              height: 34,
              background: 'var(--muted)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--foreground)',
              cursor: 'pointer',
              outlineColor: 'var(--primary)',
            }}
          >
            <Icon name="x" size={16} strokeWidth={2.25} />
          </button>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="mobile-search-list"
          role="listbox"
          aria-label="Tool results"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 10,
            background: 'linear-gradient(180deg, var(--accent-surface), var(--card) 96px)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px 8px',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          }}>
            <span>{searching ? 'Results' : 'All tools'}</span>
            <span>{results.length} {results.length === 1 ? 'tool' : 'tools'}</span>
          </div>

          {results.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '40px 16px',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 46,
                borderRadius: 'var(--radius-full)',
                background: 'var(--muted)',
                color: 'var(--muted-foreground)',
              }}>
                <Icon name="search" size={20} strokeWidth={2} />
              </div>
              <span style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--foreground-dim)',
              }}>No tools match “{query.trim()}”</span>
              <span style={{
                fontFamily: 'var(--font-geist)',
                fontSize: 12.5,
                color: 'var(--muted-foreground)',
              }}>Try “node”, “docker”, or “git”.</span>
            </div>
          ) : (
            results.map((tool, index) => {
              const chip = CAT_CHIP[tool.category]
              const active = index === highlighted
              return (
                <button
                  key={tool.id}
                  id={`ms-opt-${tool.id}`}
                  data-idx={index}
                  role="option"
                  aria-selected={active}
                  type="button"
                  onMouseMove={() => setHighlighted(index)}
                  onClick={() => go(tool)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 13,
                    width: '100%',
                    textAlign: 'left',
                    padding: 11,
                    marginBottom: 4,
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid',
                    borderColor: active ? 'var(--border)' : 'transparent',
                    background: active
                      ? 'color-mix(in srgb, var(--card) 92%, var(--primary))'
                      : 'transparent',
                    boxShadow: active ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 120ms, border-color 120ms',
                  }}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: 'var(--radius-lg)',
                    background: chip.bg,
                    color: chip.fg,
                  }}>
                    <Icon name={chip.icon} size={18} strokeWidth={2} />
                  </span>
                  <span style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flex: 1,
                    minWidth: 0,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-geist)',
                      fontSize: 15.5,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      color: 'var(--foreground)',
                    }}>{tool.name}</span>
                    <span style={{
                      fontFamily: 'var(--font-geist)',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--muted-foreground)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{tool.description}</span>
                  </span>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-jetbrains)',
                    color: chip.fg,
                    background: chip.bg,
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>{chip.label}</span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* ── Search trigger (mobile only) ─────────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Search tools"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          background: 'var(--card)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          color: 'var(--foreground)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'background 150ms, border-color 150ms, box-shadow 150ms',
          flexShrink: 0,
          outlineColor: 'var(--primary)',
        }}
      >
        <Icon name="search" size={18} strokeWidth={2} />
      </button>

      {mounted && render ? createPortal(popup, document.body) : null}
    </>
  )
}
