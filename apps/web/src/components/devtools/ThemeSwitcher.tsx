'use client'

import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'pyjs.theme'
const THEME_BG: Record<Theme, string> = { light: '#f5efe8', dark: '#14100c' }

// Keep the <meta name="theme-color"> in sync (shared pythonjs.org contract).
function setThemeColor(theme: Theme) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = THEME_BG[theme] ?? THEME_BG.light
}

function isTheme(v: unknown): v is Theme {
  return v === 'light' || v === 'dark'
}

export default function ThemeSwitcher({ onSelect }: { onSelect?: (theme: Theme) => void } = {}) {
  // Server renders 'light'; client reads localStorage / prefers-color-scheme on mount.
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const initial: Theme = isTheme(saved)
      ? saved
      : matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  function apply(next: Theme) {
    setTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    document.documentElement.setAttribute('data-theme', next)
    setThemeColor(next)
    onSelect?.(next)
  }

  function toggle(e: React.MouseEvent) {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    root.style.setProperty('--vt-x', `${e.clientX}px`)
    root.style.setProperty('--vt-y', `${e.clientY}px`)
    const startVT = (document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> }
    }).startViewTransition
    if (typeof startVT === 'function' && !reduced) {
      startVT.call(document, () => apply(next))
    } else {
      apply(next)
    }
  }

  const nextLabel = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${nextLabel} theme`}
      title={`Switch to ${nextLabel} theme`}
      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        padding: 0,
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-full)',
        background: 'var(--muted)',
        color: 'var(--foreground)',
        cursor: 'pointer',
        outlineColor: 'var(--primary)',
        transition: 'background 150ms, border-color 150ms',
      }}
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" />
        </svg>
      )}
    </button>
  )
}
