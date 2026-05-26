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
      role="tablist"
      aria-label="Operating system"
      className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800"
    >
      {OS_OPTIONS.map(({ value, label }) => {
        const isActive = selected === value
        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={[
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
