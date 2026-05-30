'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import type { IconName } from '@/components/Icon'

const NAV_ITEMS: {
  label: string
  detail: string
  href: string | null
  icon: IconName
  soon: boolean
}[] = [
  { label: 'Install',  detail: 'Tool recipes',       href: '/',  icon: 'bolt',       soon: false },
  { label: 'DB Cmds',  detail: 'Reference shelf',    href: null, icon: 'layers',     soon: true  },
  { label: 'CLI Ref',  detail: 'Command lookups',    href: null, icon: 'terminal',   soon: true  },
  { label: 'Compare',  detail: 'Pick the right fit', href: null, icon: 'git-branch', soon: true  },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [renderMenu, setRenderMenu] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    let frame = 0
    let timeout = 0

    if (open) {
      setRenderMenu(true)
      frame = window.requestAnimationFrame(() => setMenuVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }

    setMenuVisible(false)
    timeout = window.setTimeout(() => setRenderMenu(false), 360)
    return () => window.clearTimeout(timeout)
  }, [open])

  // scroll-lock while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (menuVisible) {
      closeRef.current?.focus()
      wasOpenRef.current = true
      return
    }

    if (!open && wasOpenRef.current) {
      triggerRef.current?.focus()
      wasOpenRef.current = false
    }
  }, [menuVisible, open])

  // close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // close on Escape + focus trap
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }

      if (e.key !== 'Tab' || !drawerRef.current) return

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
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
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const menu = (
    <>
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          background: 'color-mix(in srgb, var(--foreground) 44%, transparent)',
          backdropFilter: 'blur(8px) saturate(0.95)',
          WebkitBackdropFilter: 'blur(8px) saturate(0.95)',
          opacity: menuVisible ? 1 : 0,
          pointerEvents: menuVisible ? 'auto' : 'none',
          transition: 'opacity 360ms cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* ── Drawer ───────────────────────────────────────────── */}
      <div
        ref={drawerRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuVisible}
        aria-label="Site navigation"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(100vw, 360px)',
          height: '100dvh',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--card)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow-2xl)',
          opacity: menuVisible ? 1 : 0.98,
          pointerEvents: menuVisible ? 'auto' : 'none',
          transform: menuVisible ? 'translateX(0)' : 'translateX(calc(100% + 16px))',
          transition:
            'transform 360ms cubic-bezier(0.16,1,0.3,1), opacity 220ms ease-out',
          overflow: 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 72,
          padding: 'max(16px, env(safe-area-inset-top)) 18px 16px',
          borderBottom: '1px solid var(--border-soft)',
          flexShrink: 0,
          opacity: menuVisible ? 1 : 0,
          transform: menuVisible ? 'translateY(0)' : 'translateY(-8px)',
          transition:
            'opacity 260ms ease-out 80ms, transform 320ms cubic-bezier(0.16,1,0.3,1) 80ms',
        }}>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              background: 'var(--foreground)',
              color: 'var(--background)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              boxShadow: 'var(--shadow-md)',
            }}>›_</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{
                fontFamily: 'var(--font-geist)',
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: 0,
                color: 'var(--foreground)',
                lineHeight: 1.05,
              }}>DevSetup</span>
              <span style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
              }}>v1.0 menu</span>
            </span>
          </Link>

          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              background: 'var(--muted)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--foreground)',
              flexShrink: 0,
              outlineColor: 'var(--primary)',
            }}
          >
            <Icon name="x" size={18} strokeWidth={2.25} />
          </button>
        </div>

        {/* Nav list */}
        <nav style={{
          flex: 1,
          padding: 18,
          overflowY: 'auto',
          background: 'linear-gradient(180deg, var(--accent-surface), var(--card) 128px)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 14,
            padding: '9px 12px',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-full)',
            background: 'color-mix(in srgb, var(--card) 78%, transparent)',
            color: 'var(--foreground-dim)',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1,
            boxShadow: 'var(--shadow-sm)',
            opacity: menuVisible ? 1 : 0,
            transform: menuVisible ? 'translateY(0)' : 'translateY(10px)',
            transition:
              'opacity 260ms ease-out 120ms, transform 320ms cubic-bezier(0.16,1,0.3,1) 120ms',
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary)',
              flexShrink: 0,
            }} />
            All guides verified
          </div>

          {NAV_ITEMS.map((item, index) => {
            const isActive = !item.soon && pathname === item.href
            const delay = menuVisible ? 150 + index * 38 : 0

            const iconCell = (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 46,
                borderRadius: 'var(--radius-lg)',
                background: isActive
                  ? 'var(--primary)'
                  : 'color-mix(in srgb, var(--surface-2) 82%, var(--card))',
                color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                flexShrink: 0,
                boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                transition: 'background 150ms, color 150ms, transform 150ms',
              }}>
                <Icon name={item.icon} size={20} strokeWidth={2} />
              </div>
            )

            const labelCell = (
              <span style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                flex: 1,
                minWidth: 0,
              }}>
                <span style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 0,
                  lineHeight: 1.15,
                  color: isActive
                    ? 'var(--foreground)'
                    : item.soon
                      ? 'var(--muted-foreground)'
                      : 'var(--foreground-dim)',
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-geist)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 0,
                  lineHeight: 1.2,
                  color: item.soon
                    ? 'color-mix(in srgb, var(--muted-foreground) 72%, transparent)'
                    : 'var(--foreground-dim)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.detail}
                </span>
              </span>
            )

            const trailingCell = item.soon ? (
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                background: 'color-mix(in srgb, var(--muted) 78%, transparent)',
                padding: '5px 9px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-jetbrains)',
                whiteSpace: 'nowrap',
              }}>soon</span>
            ) : isActive ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: 'var(--radius-full)',
                background: 'var(--card)',
                color: 'var(--primary)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <Icon name="arrow" size={15} strokeWidth={2.5} />
              </span>
            ) : null

            const baseRowStyle = {
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: 14,
              borderRadius: 'var(--radius-xl)',
              minHeight: 78,
              border: '1px solid',
              marginBottom: 10,
            } as const

            return item.href ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  ...baseRowStyle,
                  background: isActive
                    ? 'color-mix(in srgb, var(--primary-soft) 84%, var(--card))'
                    : 'color-mix(in srgb, var(--card) 76%, transparent)',
                  borderColor: isActive ? 'var(--border)' : 'var(--border-soft)',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  textDecoration: 'none',
                  opacity: menuVisible ? 1 : 0,
                  transform: menuVisible ? 'translateY(0)' : 'translateY(14px)',
                  transition:
                    `background 150ms, border-color 150ms, box-shadow 150ms, opacity 260ms ease-out ${delay}ms, transform 340ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
                  outlineColor: 'var(--primary)',
                }}
              >
                {iconCell}{labelCell}{trailingCell}
              </Link>
            ) : (
              <div
                key={item.label}
                aria-disabled="true"
                style={{
                  ...baseRowStyle,
                  background: 'color-mix(in srgb, var(--card) 48%, transparent)',
                  borderColor: 'transparent',
                  opacity: menuVisible ? 0.72 : 0,
                  transform: menuVisible ? 'translateY(0)' : 'translateY(14px)',
                  transition:
                    `opacity 260ms ease-out ${delay}ms, transform 340ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
                  cursor: 'default',
                }}
              >
                {iconCell}{labelCell}{trailingCell}
              </div>
            )
          })}
        </nav>

        {/* Drawer footer — theme switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          padding: '16px 20px max(16px, env(safe-area-inset-bottom))',
          borderTop: '1px solid var(--border-soft)',
          background: 'var(--card)',
          flexShrink: 0,
          opacity: menuVisible ? 1 : 0,
          transform: menuVisible ? 'translateY(0)' : 'translateY(10px)',
          transition:
            'opacity 260ms ease-out 230ms, transform 320ms cubic-bezier(0.16,1,0.3,1) 230ms',
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-jetbrains)',
            color: 'var(--muted-foreground)',
          }}>Theme</span>
          {/* picking a theme is a completed action — dismiss the drawer
              after a beat so the freshly themed page is revealed */}
          <ThemeSwitcher onSelect={() => window.setTimeout(() => setOpen(false), 220)} />
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* ── Hamburger trigger (mobile only) ──────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(o => !o)}
        className="md:hidden flex flex-col items-center justify-center"
        style={{
          width: 44,
          height: 44,
          gap: 4,
          padding: '12px 10px',
          background: open ? 'var(--foreground)' : 'var(--card)',
          border: '1px solid',
          borderColor: open ? 'var(--foreground)' : 'var(--border-soft)',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'background 150ms, border-color 150ms, box-shadow 150ms',
          flexShrink: 0,
          outlineColor: 'var(--primary)',
        }}
      >
        <span style={{
          display: 'block', width: 18, height: 2,
          background: open ? 'var(--background)' : 'var(--foreground)', borderRadius: 2,
          transformOrigin: '50% 50%',
          transition: 'transform 280ms cubic-bezier(0.16,1,0.3,1)',
          transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
        }} />
        <span style={{
          display: 'block', width: 14, height: 2,
          background: open ? 'var(--background)' : 'var(--foreground)', borderRadius: 2,
          transition: 'opacity 180ms, transform 200ms',
          opacity: open ? 0 : 1,
          transform: open ? 'scaleX(0)' : 'none',
          alignSelf: 'flex-end',
        }} />
        <span style={{
          display: 'block', width: 18, height: 2,
          background: open ? 'var(--background)' : 'var(--foreground)', borderRadius: 2,
          transformOrigin: '50% 50%',
          transition: 'transform 280ms cubic-bezier(0.16,1,0.3,1)',
          transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
        }} />
      </button>

      {mounted && renderMenu ? createPortal(menu, document.body) : null}
    </>
  )
}
