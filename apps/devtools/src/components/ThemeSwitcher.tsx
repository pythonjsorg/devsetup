'use client'

import { useEffect, useState } from 'react'
import { setThemeColor } from '@/components/themeBootScript'

export type Theme = 'paper' | 'carbon' | 'cobalt'

const THEMES: { id: Theme; bg: string; accent: string; label: string }[] = [
  { id: 'paper',  bg: '#f4ede0', accent: '#7a5530', label: 'Paper'  },
  { id: 'carbon', bg: '#0e0f13', accent: '#c8fa00', label: 'Carbon' },
  { id: 'cobalt', bg: '#eef1f6', accent: '#2647e8', label: 'Cobalt' },
]

const STORAGE_KEY = 'devsetup-theme'
const DEFAULT_THEME: Theme = 'paper'

function isTheme(v: unknown): v is Theme {
  return v === 'paper' || v === 'carbon' || v === 'cobalt'
}

export default function ThemeSwitcher({ onSelect }: { onSelect?: (theme: Theme) => void } = {}) {
  // Server render with the default to avoid hydration mismatch; client
  // useEffect reads localStorage and updates.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isTheme(saved) && saved !== theme) {
      setTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(next: Theme) {
    setTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.setAttribute('data-theme', next)
    setThemeColor(next)
    onSelect?.(next)
  }

  return (
    <div
      role="group"
      aria-label="Color theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: 4,
        background: 'var(--muted)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-soft)',
      }}
    >
      {THEMES.map(t => {
        const active = t.id === theme
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => handleChange(t.id)}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
            aria-pressed={active}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              border: 'none',
              padding: 0,
              background: active ? 'var(--card)' : 'transparent',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              opacity: active ? 1 : 0.75,
              transition: 'opacity 150ms, background 150ms',
              outlineColor: 'var(--primary)',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = '0.75' }}
          >
            <span
              style={{
                position: 'relative',
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: t.bg,
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: t.accent,
                  clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                }}
              />
            </span>
          </button>
        )
      })}
    </div>
  )
}
