'use client'

import type { OS } from '@/data/tools'

type Props = {
  selected: OS
  onChange: (os: OS) => void
}

const OS_OPTIONS: { value: OS; label: string; mono: string }[] = [
  { value: 'macos', label: 'macOS', mono: 'darwin' },
  { value: 'windows', label: 'Windows', mono: 'win32' },
  { value: 'linux', label: 'Linux', mono: 'linux' },
]

export default function OsPicker({ selected, onChange }: Props) {
  return (
    <div className="flex items-center gap-0" aria-label="Operating system">
      {OS_OPTIONS.map(({ value, label, mono }, idx) => {
        const isActive = selected === value
        return (
          <button
            key={value}
            aria-pressed={isActive}
            onClick={() => onChange(value)}
            className="relative flex flex-col items-start px-4 py-2.5 text-sm font-medium transition-all duration-150"
            style={{
              background: isActive ? 'var(--accent)' : 'var(--surface)',
              color: isActive ? 'var(--bg)' : 'var(--muted)',
              border: '1px solid var(--border-col)',
              borderLeft: idx === 0 ? '1px solid var(--border-col)' : 'none',
              fontFamily: 'var(--font-syne)',
            }}
          >
            <span className="font-bold text-sm">{label}</span>
            <span
              className="text-xs font-mono leading-none mt-0.5"
              style={{
                color: isActive ? 'rgba(8,10,8,0.6)' : 'var(--muted)',
                fontFamily: 'var(--font-geist-mono)',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              {mono}
            </span>
          </button>
        )
      })}
    </div>
  )
}
