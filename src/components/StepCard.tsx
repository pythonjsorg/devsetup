import React from 'react'

type Props = {
  stepNumber: number
  title: string
  badge?: React.ReactNode
  children: React.ReactNode
}

export default function StepCard({ stepNumber, title, badge, children }: Props) {
  const num = String(stepNumber).padStart(2, '0')

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-col)',
      }}
    >
      {/* Ghost step number */}
      <div
        aria-hidden="true"
        className="absolute right-4 top-1/2 -translate-y-1/2 font-extrabold leading-none select-none pointer-events-none"
        style={{
          fontSize: 'clamp(4rem, 12vw, 8rem)',
          color: 'var(--fg)',
          opacity: 0.025,
          letterSpacing: '-0.05em',
          fontFamily: 'var(--font-syne)',
        }}
      >
        {num}
      </div>

      <div className="relative p-6">
        {/* Step label */}
        <div
          className="flex items-center gap-3 mb-4"
        >
          <div
            className="flex items-center justify-center h-6 w-6 text-xs font-bold font-mono shrink-0"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-geist-mono)',
            }}
          >
            {stepNumber}
          </div>
          <div
            className="h-px flex-1"
            style={{ background: 'var(--border-col)' }}
          />
          <span
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)' }}
          >
            Step {num}
          </span>
        </div>

        {/* Title + badge */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3
            className="text-lg font-bold"
            style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h3>
          {badge}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
