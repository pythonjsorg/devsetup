'use client'

import type { OS } from '@/data/tools'

type Props = {
  selected: OS
  onChange: (os: OS) => void
}

const OS_OPTIONS: { value: OS; label: string }[] = [
  { value: 'macos', label: 'macOS' },
  { value: 'windows', label: 'Windows' },
  { value: 'linux', label: 'Linux' },
]

export default function OsPicker({ selected, onChange }: Props) {
  return (
    <div
      aria-label="Operating system"
      className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1"
    >
      {OS_OPTIONS.map(({ value, label }) => {
        const isActive = selected === value
        return (
          <button
            key={value}
            aria-pressed={isActive}
            onClick={() => onChange(value)}
            className={[
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
