'use client'

import type { OS } from '@/data/tools'
import Icon, { type IconName } from '@/components/Icon'

type Props = {
  selected: OS
  onChange: (os: OS) => void
}

const OPTIONS: { value: OS; label: string; mono: string; icon: IconName }[] = [
  { value: 'macos',   label: 'macOS',   mono: 'darwin', icon: 'apple'   },
  { value: 'windows', label: 'Windows', mono: 'win32',  icon: 'windows' },
  { value: 'linux',   label: 'Linux',   mono: 'linux',  icon: 'monitor' },
]

export default function OsPicker({ selected, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Operating system"
      className="inline-flex"
      style={{
        background: 'var(--muted)',
        borderRadius: 'var(--radius-full)',
        padding: 4,
        gap: 2,
      }}
    >
      {OPTIONS.map(({ value, label, mono, icon }) => {
        const active = selected === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(value)}
            className="inline-flex items-center gap-2.5 whitespace-nowrap"
            style={{
              padding: '10px 18px',
              background: active ? 'var(--card)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
              fontFamily: 'var(--font-geist)',
              transition: 'background 120ms, box-shadow 120ms',
            }}
          >
            <Icon
              name={icon}
              size={16}
              color={active ? 'var(--primary)' : 'var(--muted-foreground)'}
              strokeWidth={active ? 2.25 : 1.75}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 11,
                color: 'var(--muted-foreground)',
                opacity: active ? 0.9 : 0.6,
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
