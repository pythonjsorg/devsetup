import React from 'react'
import type { Tool } from '@/data/tools'
import Icon, { type IconName } from './Icon'

const CAT: Record<
  Tool['category'],
  { icon: IconName; bg: string; fg: string }
> = {
  runtime:           { icon: 'bolt',     bg: 'var(--cat-runtime-bg)', fg: 'var(--cat-runtime-fg)' },
  'ai-tool':         { icon: 'sparkles', bg: 'var(--cat-ai-bg)',      fg: 'var(--cat-ai-fg)' },
  'package-manager': { icon: 'package',    bg: 'var(--cat-pkg-bg)',      fg: 'var(--cat-pkg-fg)'      },
  platform:          { icon: 'layers',     bg: 'var(--cat-platform-bg)', fg: 'var(--cat-platform-fg)' },
  vcs:               { icon: 'git-branch', bg: 'var(--cat-vcs-bg)',      fg: 'var(--cat-vcs-fg)'      },
}

type Props = {
  stepNumber: number
  total: number
  tool: Tool
  isCurrent: boolean      // true if this is the target tool, false for deps
  badge?: React.ReactNode
  children: React.ReactNode
}

export default function StepCard({
  stepNumber,
  total,
  tool,
  isCurrent,
  badge,
  children,
}: Props) {
  const cat = CAT[tool.category]

  return (
    <article
      className="relative"
      style={{
        background: 'var(--card)',
        border: isCurrent
          ? '2px solid var(--primary)'
          : '1px solid var(--border)',
        borderRadius: 'var(--radius-2xl)',
        padding: 24,
        boxShadow: isCurrent ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
    >
      {/* Step header */}
      <div className="flex items-center gap-3.5 mb-4">
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-full)',
            background: isCurrent ? 'var(--primary)' : 'var(--muted)',
            color: isCurrent
              ? 'var(--primary-foreground)'
              : 'var(--foreground-dim)',
            fontFamily: 'var(--font-jetbrains)',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {stepNumber}
        </div>
        <div
          className="flex-1"
          style={{ height: 1, background: 'var(--border-soft)' }}
        />
        <span
          className="whitespace-nowrap"
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-jetbrains)',
          }}
        >
          step {stepNumber}/{total} ·{' '}
          {isCurrent ? 'target' : 'dependency'}
        </span>
      </div>

      {/* Title row */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            background: cat.bg,
            color: cat.fg,
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Icon name={cat.icon} size={16} strokeWidth={2.25} />
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-geist)',
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '-0.025em',
            color: 'var(--foreground)',
            margin: 0,
          }}
        >
          Install {tool.name}
        </h3>
        {badge}
      </div>

      {/* Description */}
      <p
        className="mb-4 max-w-2xl"
        style={{
          fontSize: 13.5,
          lineHeight: 1.55,
          color: 'var(--foreground-dim)',
          margin: '0 0 16px',
        }}
      >
        {tool.description}
      </p>

      {/* Slot: command block */}
      <div>{children}</div>
    </article>
  )
}
