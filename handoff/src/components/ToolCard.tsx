'use client'

import Link from 'next/link'
import type { Tool } from '@/data/tools'
import { TOOLS } from '@/data/tools'
import Icon, { type IconName } from '@/components/Icon'

type Props = { tool: Tool }

const CAT: Record<
  Tool['category'],
  { label: string; icon: IconName; bg: string; fg: string }
> = {
  runtime: {
    label: 'Runtime',
    icon: 'bolt',
    bg: 'var(--cat-runtime-bg)',
    fg: 'var(--cat-runtime-fg)',
  },
  'ai-tool': {
    label: 'AI agent',
    icon: 'sparkles',
    bg: 'var(--cat-ai-bg)',
    fg: 'var(--cat-ai-fg)',
  },
  'package-manager': {
    label: 'Pkg manager',
    icon: 'package',
    bg: 'var(--cat-pkg-bg)',
    fg: 'var(--cat-pkg-fg)',
  },
  platform: {
    label: 'Platform',
    icon: 'layers',
    bg: 'var(--cat-platform-bg)',
    fg: 'var(--cat-platform-fg)',
  },
  vcs: {
    label: 'VCS',
    icon: 'git-branch',
    bg: 'var(--cat-vcs-bg)',
    fg: 'var(--cat-vcs-fg)',
  },
}

export default function ToolCard({ tool }: Props) {
  const cat = CAT[tool.category]
  const depNames = tool.dependencies.map(
    depId => TOOLS.find(t => t.id === depId)?.name ?? depId
  )

  return (
    <Link
      href={`/install/${tool.id}`}
      className="group flex flex-col gap-3.5 transition-colors"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-2xl)',
        padding: 22,
        boxShadow: 'var(--shadow-sm)',
        textDecoration: 'none',
      }}
    >
      {/* Top: icon + category pill */}
      <div className="flex items-start justify-between">
        <div
          className="flex items-center justify-center"
          style={{
            width: 46,
            height: 46,
            background: cat.bg,
            color: cat.fg,
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Icon name={cat.icon} size={22} strokeWidth={2} />
        </div>
        <span
          className="whitespace-nowrap"
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: cat.fg,
            background: cat.bg,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-jetbrains)',
          }}
        >
          {cat.label}
        </span>
      </div>

      {/* Name */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-geist)',
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: 0,
            color: 'var(--foreground)',
          }}
        >
          {tool.name}
        </h2>
        {tool.lts && (
          <div
            className="inline-flex items-center gap-1.5 mt-1.5 whitespace-nowrap"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'var(--cat-pkg-fg)',
              fontFamily: 'var(--font-jetbrains)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--cat-pkg-fg)',
              }}
            />
            LTS v{tool.lts.version} · 30-mo
          </div>
        )}
      </div>

      {/* Description */}
      <p
        className="flex-1"
        style={{
          fontSize: 13.5,
          lineHeight: 1.55,
          color: 'var(--foreground-dim)',
          margin: 0,
          textWrap: 'pretty',
        }}
      >
        {tool.description}
      </p>

      {/* Footer */}
      <div
        className="flex items-center pt-3"
        style={{
          borderTop: '1px solid var(--border-soft)',
          fontSize: 12,
          fontFamily: 'var(--font-jetbrains)',
        }}
      >
        {depNames.length > 0 ? (
          <span
            className="whitespace-nowrap"
            style={{ color: 'var(--muted-foreground)' }}
          >
            ↳ needs{' '}
            <strong style={{ color: 'var(--foreground)' }}>
              {depNames.join(', ')}
            </strong>
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 whitespace-nowrap"
            style={{ color: 'var(--cat-pkg-fg)', fontWeight: 600 }}
          >
            <Icon name="check" size={12} strokeWidth={2.5} />
            standalone
          </span>
        )}
        <span
          className="ml-auto inline-flex items-center gap-1 whitespace-nowrap transition-transform group-hover:translate-x-0.5"
          style={{ color: 'var(--primary)', fontWeight: 600 }}
        >
          install
          <Icon name="arrow" size={12} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  )
}
