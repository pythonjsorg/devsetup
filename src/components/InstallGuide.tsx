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
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Install {mainTool.name}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {mainTool.description}
        </p>
      </div>

      <div className="mb-8">
        <OsPicker selected={os} onChange={handleOsChange} />
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const commands = getCommandsForOs(step, os)
          return (
            <StepCard
              key={step.id}
              stepNumber={index + 1}
              title={step.name}
              badge={
                step.lts ? (
                  <LtsBadge
                    version={step.lts.version}
                    label={step.lts.label}
                  />
                ) : undefined
              }
            >
              {commands.length > 0 ? (
                <CommandBlock commands={commands} />
              ) : (
                <p className="text-sm text-zinc-500">
                  No install method available for this OS.
                </p>
              )}
            </StepCard>
          )
        })}
      </div>
    </main>
  )
}
