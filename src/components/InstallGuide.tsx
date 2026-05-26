'use client'

import { useState, useEffect } from 'react'
import type { OS, Tool, InstallMethods } from '@/data/tools'
import OsPicker from '@/components/OsPicker'
import StepCard from '@/components/StepCard'
import CommandBlock from '@/components/CommandBlock'
import LtsBadge from '@/components/LtsBadge'

function getCommandsForOs(tool: Tool, os: OS): string[] {
  const methods = tool.install[os] as InstallMethods
  return (
    methods.homebrew ??
    methods.winget ??
    methods.apt ??
    methods.curl ??
    methods.manual ??
    []
  )
}

function detectOs(): OS {
  const uaData = (
    navigator as Navigator & { userAgentData?: { platform?: string } }
  ).userAgentData

  const platform =
    uaData?.platform ?? navigator.platform ?? ''

  const p = platform.toLowerCase()
  if (p.includes('mac')) return 'macos'
  if (p.includes('win')) return 'windows'
  return 'linux'
}

type Props = {
  steps: Tool[]
}

export default function InstallGuide({ steps }: Props) {
  // Use deterministic default to avoid hydration mismatch.
  // OS detection and localStorage read happen in useEffect (client-only).
  const [os, setOs] = useState<OS>('macos')

  useEffect(() => {
    const saved = localStorage.getItem('preferred-os') as OS | null
    if (saved && (['macos', 'windows', 'linux'] as OS[]).includes(saved)) {
      setOs(saved)
    } else {
      setOs(detectOs())
    }
  }, [])

  function handleOsChange(newOs: OS) {
    setOs(newOs)
    localStorage.setItem('preferred-os', newOs)
  }

  // The tool being installed is always the last step (deps come first).
  const mainTool = steps[steps.length - 1]

  return (
    <main className="flex flex-col flex-1">
      {/* Compact docs-style header */}
      <header style={{ borderBottom: '1px solid var(--border-col)' }}>
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-7">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 mb-5 text-xs uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-geist-mono)', color: 'var(--muted)' }}
          >
            <span>install</span>
            <span style={{ color: 'var(--border-accent)', fontSize: '0.6rem' }}>▶</span>
            <span style={{ color: 'var(--accent)' }}>{mainTool.name}</span>
          </div>

          {/* Tool name + optional LTS badge */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1
              className="font-extrabold"
              style={{
                fontSize: '1.875rem',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--fg)',
                fontFamily: 'var(--font-syne)',
              }}
            >
              {mainTool.name}
            </h1>
            {mainTool.lts && (
              <LtsBadge version={mainTool.lts.version} label={mainTool.lts.label} />
            )}
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: 'var(--fg-dim)', maxWidth: '38rem' }}
          >
            {mainTool.description}
          </p>

          {/* OS picker row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-xs uppercase tracking-widest shrink-0"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)' }}
            >
              Platform
            </span>
            <div style={{ width: '1px', height: '12px', background: 'var(--border-col)' }} />
            <OsPicker selected={os} onChange={handleOsChange} />
          </div>
        </div>
      </header>

      {/* Steps */}
      <section className="mx-auto w-full max-w-3xl px-6 py-8">
        {/* Steps label */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}
          >
            {steps.length === 1 ? '1 step' : `${steps.length} steps`}
            {steps.length > 1 && ' — deps resolved'}
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--border-col)' }} />
        </div>

        <div className="flex flex-col gap-3">
          {steps.map((step, index) => {
            const commands = getCommandsForOs(step, os)
            return (
              <StepCard
                key={step.id}
                stepNumber={index + 1}
                title={step.name}
                badge={
                  step.lts ? (
                    <LtsBadge version={step.lts.version} label={step.lts.label} />
                  ) : undefined
                }
              >
                {commands.length > 0 ? (
                  <CommandBlock commands={commands} />
                ) : (
                  <p
                    className="text-sm font-mono"
                    style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)' }}
                  >
                    No install method for this platform.
                  </p>
                )}
              </StepCard>
            )
          })}
        </div>
      </section>
    </main>
  )
}
