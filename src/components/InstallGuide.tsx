'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { OS, Tool, InstallMethods, LtsEntry } from '@/data/tools'
import OsPicker from '@/components/OsPicker'
import StepCard from '@/components/StepCard'
import CommandBlock from '@/components/CommandBlock'
import LtsBadge from '@/components/LtsBadge'
import Icon from '@/components/Icon'

// ── method helpers ────────────────────────────────────────────────────────────

const METHOD_ORDER: (keyof InstallMethods)[] = [
  'nvm', 'homebrew', 'winget', 'apt', 'curl', 'manual',
]

const METHOD_LABELS: Record<keyof InstallMethods, string> = {
  nvm:      'nvm',
  homebrew: 'Homebrew',
  winget:   'winget',
  apt:      'apt',
  curl:     'curl',
  manual:   'Manual',
}

function getAvailableMethods(
  install: Record<OS, InstallMethods>,
  os: OS,
): (keyof InstallMethods)[] {
  const methods = install[os] as InstallMethods
  return METHOD_ORDER.filter(m => (methods[m]?.length ?? 0) > 0)
}

function getCommandsForOs(
  install: Record<OS, InstallMethods>,
  os: OS,
  preferred?: keyof InstallMethods,
): string[] {
  const methods = install[os] as InstallMethods
  if (preferred && methods[preferred]?.length) return methods[preferred]!
  for (const m of METHOD_ORDER) {
    if (methods[m]?.length) return methods[m]!
  }
  return []
}

// ── OS detection ──────────────────────────────────────────────────────────────

function detectOs(): OS {
  const uaData = (
    navigator as Navigator & { userAgentData?: { platform?: string } }
  ).userAgentData
  const platform = uaData?.platform ?? navigator.platform ?? ''
  const p = platform.toLowerCase()
  if (p.includes('mac')) return 'macos'
  if (p.includes('win')) return 'windows'
  return 'linux'
}

// ── LTS helpers ───────────────────────────────────────────────────────────────

function monthsRemaining(eol: string): number {
  return (new Date(eol).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)
}

function hasMinSupport(eol: string, months = 12): boolean {
  return monthsRemaining(eol) >= months
}

// ── component ─────────────────────────────────────────────────────────────────

type Props = { steps: Tool[] }

export default function InstallGuide({ steps }: Props) {
  const [os, setOs] = useState<OS>('macos')
  const [method, setMethod] = useState<keyof InstallMethods | null>(null)
  const [selectedLts, setSelectedLts] = useState<LtsEntry | null>(null)

  const mainTool = steps[steps.length - 1]
  const ltsVersions = mainTool.ltsVersions as LtsEntry[]

  // initialise LTS selection to the first version with ≥ 12 months support
  useEffect(() => {
    if (ltsVersions.length > 0) {
      const best = ltsVersions.find(v => hasMinSupport(v.eol)) ?? ltsVersions[0]
      setSelectedLts(best)
    }
  }, [mainTool.id]) // eslint-disable-line react-hooks/exhaustive-deps

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
    setMethod(null)
    localStorage.setItem('preferred-os', newOs)
  }

  function handleLtsChange(v: LtsEntry) {
    setSelectedLts(v)
    setMethod(null)
  }

  // ── category display maps ─────────────────────────────────────────────────
  const catLabel: Record<Tool['category'], string> = {
    runtime: 'Runtime',
    'ai-tool': 'AI agent',
    'package-manager': 'Pkg manager',
    platform: 'Platform',
    vcs: 'VCS',
  }
  const catBg: Record<Tool['category'], string> = {
    runtime: 'var(--cat-runtime-bg)',
    'ai-tool': 'var(--cat-ai-bg)',
    'package-manager': 'var(--cat-pkg-bg)',
    platform: 'var(--cat-platform-bg)',
    vcs: 'var(--cat-vcs-bg)',
  }
  const catFg: Record<Tool['category'], string> = {
    runtime: 'var(--cat-runtime-fg)',
    'ai-tool': 'var(--cat-ai-fg)',
    'package-manager': 'var(--cat-pkg-fg)',
    platform: 'var(--cat-platform-fg)',
    vcs: 'var(--cat-vcs-fg)',
  }
  const catIcon = {
    runtime: 'bolt',
    'ai-tool': 'sparkles',
    'package-manager': 'package',
    platform: 'layers',
    vcs: 'git-branch',
  } as const

  // ── effective install for each step ──────────────────────────────────────
  function effectiveInstall(step: Tool) {
    return selectedLts && step.id === mainTool.id
      ? selectedLts.install
      : step.install
  }

  // ── method picker: based on main tool's effective install ─────────────────
  const mainInstall = effectiveInstall(mainTool)
  const availableMethods = getAvailableMethods(mainInstall, os)
  const activeMethod = method ?? availableMethods[0] ?? null

  return (
    <main className="flex flex-col flex-1">
      {/* ── Page header ────────────────────────────────────────── */}
      <header>
        <div className="mx-auto max-w-3xl px-6 pt-10 pb-2">
          {/* Breadcrumb */}
          <div
            className="inline-flex items-center gap-2 mb-5.5 whitespace-nowrap"
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-jetbrains)',
              color: 'var(--muted-foreground)',
              letterSpacing: '0.04em',
            }}
          >
            <Link
              href="/"
              style={{ color: 'var(--muted-foreground)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
            >
              ~/tools
            </Link>
            <span style={{ opacity: 0.5 }}>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {mainTool.id}
            </span>
          </div>

          {/* Title row */}
          <div className="flex items-start gap-5 mb-4">
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 64,
                height: 64,
                background: catBg[mainTool.category],
                color: catFg[mainTool.category],
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Icon name={catIcon[mainTool.category]} size={30} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h1
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontSize: 'clamp(1.75rem, 8vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 1,
                  margin: 0,
                  color: 'var(--foreground)',
                }}
              >
                Install{' '}
                <em
                  style={{
                    fontFamily: 'var(--font-instrument-serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'var(--primary)',
                  }}
                >
                  {mainTool.name}
                </em>
              </h1>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: catFg[mainTool.category],
                    background: catBg[mainTool.category],
                    padding: '4px 11px',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  {catLabel[mainTool.category]}
                </span>
                {steps.length > 1 && (
                  <span
                    className="inline-flex items-center gap-1.5 whitespace-nowrap"
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      color: 'var(--muted-foreground)',
                      background: 'var(--muted)',
                      padding: '4px 11px',
                      borderRadius: 'var(--radius-full)',
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                  >
                    ↳ requires{' '}
                    {steps.slice(0, -1).map(s => s.name).join(', ')}
                  </span>
                )}
                <span
                  className="inline-flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    color: 'var(--muted-foreground)',
                    background: 'var(--muted)',
                    padding: '4px 11px',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  {steps.length} step{steps.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p
            className="max-w-xl mb-7"
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--foreground-dim)',
              margin: '0 0 28px',
              textWrap: 'pretty',
            }}
          >
            {mainTool.description}
          </p>

          {/* OS picker */}
          <OsPicker selected={os} onChange={handleOsChange} />

          {/* LTS version picker — only when tool has multiple versions */}
          {ltsVersions.length > 1 && (
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                version
              </span>
              <div
                className="inline-flex gap-1 flex-wrap"
                style={{
                  background: 'var(--muted)',
                  borderRadius: 'var(--radius-full)',
                  padding: 3,
                }}
              >
                {ltsVersions.map(v => {
                  const isActive = v.version === selectedLts?.version
                  const supported = hasMinSupport(v.eol)
                  const months = Math.round(monthsRemaining(v.eol))
                  return (
                    <button
                      key={v.version}
                      type="button"
                      onClick={() => handleLtsChange(v)}
                      className="inline-flex items-center gap-2 whitespace-nowrap"
                      style={{
                        padding: '7px 14px',
                        background: isActive ? 'var(--card)' : 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                      }}
                    >
                      v{v.major}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: isActive
                            ? supported ? 'var(--cat-pkg-fg)' : 'var(--cat-ai-fg)'
                            : 'var(--muted-foreground)',
                          opacity: isActive ? 1 : 0.7,
                        }}
                      >
                        {v.label}
                      </span>
                      {!supported && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            background: 'var(--cat-ai-bg)',
                            color: 'var(--cat-ai-fg)',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          {months}mo
                        </span>
                      )}
                      {supported && v.status === 'active' && isActive && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            background: 'var(--cat-pkg-bg)',
                            color: 'var(--cat-pkg-fg)',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          LTS
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              {selectedLts && !hasMinSupport(selectedLts.eol) && (
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--cat-ai-fg)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  ⚠ EOL {selectedLts.eol} — consider upgrading to v{ltsVersions.find(v => hasMinSupport(v.eol))?.major}
                </span>
              )}
            </div>
          )}

          {/* Method picker — shown when 2+ methods available for this OS */}
          {availableMethods.length > 1 && (
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                via
              </span>
              <div
                className="inline-flex gap-1"
                style={{
                  background: 'var(--muted)',
                  borderRadius: 'var(--radius-full)',
                  padding: 3,
                }}
              >
                {availableMethods.map(m => {
                  const isActive = m === activeMethod
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className="whitespace-nowrap"
                      style={{
                        padding: '6px 14px',
                        background: isActive ? 'var(--card)' : 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                      }}
                    >
                      {METHOD_LABELS[m]}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Steps ──────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-3xl px-6 py-8">
        {/* Steps label row */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="whitespace-nowrap"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              fontFamily: 'var(--font-jetbrains)',
            }}
          >
            {steps.length} step{steps.length > 1 ? 's' : ''}
            {steps.length > 1 ? ' · deps resolved' : ''}
          </span>
          <div
            className="flex-1"
            style={{ height: 1, background: 'var(--border-soft)' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((step, i) => {
            const install = effectiveInstall(step)
            const commands = getCommandsForOs(install, os, activeMethod ?? undefined)

            // LTS badge: for the main tool use selected LTS info if available
            const ltsDisplay =
              selectedLts && step.id === mainTool.id
                ? { version: selectedLts.version, label: selectedLts.label }
                : step.lts

            return (
              <StepCard
                key={step.id}
                stepNumber={i + 1}
                total={steps.length}
                tool={step}
                isCurrent={i === steps.length - 1}
                badge={
                  ltsDisplay ? (
                    <LtsBadge
                      version={ltsDisplay.version}
                      label={ltsDisplay.label}
                    />
                  ) : undefined
                }
              >
                {commands.length > 0 ? (
                  <CommandBlock commands={commands} />
                ) : (
                  <p
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: 13,
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    No install method for this platform.
                  </p>
                )}
              </StepCard>
            )
          })}
        </div>

        {/* Success banner */}
        <div
          className="relative overflow-hidden mt-6 flex items-center gap-5"
          style={{
            background: 'var(--foreground)',
            color: 'var(--background)',
            borderRadius: 'var(--radius-2xl)',
            padding: '26px 28px',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -60,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'var(--highlight)',
              opacity: 0.4,
              filter: 'blur(48px)',
            }}
          />
          <div
            className="flex items-center justify-center shrink-0 relative"
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-full)',
              background: 'var(--highlight)',
              color: 'var(--highlight-foreground)',
            }}
          >
            <Icon name="check" size={26} strokeWidth={2.75} />
          </div>
          <div className="flex-1 relative">
            <h4
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--background)',
                margin: 0,
                letterSpacing: '-0.025em',
              }}
            >
              That&rsquo;s it.{' '}
              <em
                style={{
                  fontFamily: 'var(--font-instrument-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--highlight)',
                }}
              >
                You&rsquo;re set up.
              </em>
            </h4>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: 'color-mix(in srgb, var(--background) 70%, transparent)',
                margin: '4px 0 0',
              }}
            >
              Run{' '}
              <code
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  background: 'rgba(255,255,255,0.12)',
                  padding: '1px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  color: 'var(--highlight)',
                }}
              >
                {mainTool.id.replace('-cli', '')}
              </code>{' '}
              in any project to start.
            </p>
          </div>
        </div>
      </section>

      {/* ── Get started (tips) ──────────────────────────── */}
      {mainTool.tips && (
        <section className="mx-auto w-full max-w-3xl px-6 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--primary)',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              Get started
            </span>
            <div
              className="flex-1"
              style={{ height: 1, background: 'var(--border-soft)' }}
            />
          </div>

          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '20px 24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p
              className="mb-3"
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-jetbrains)',
                color: 'var(--muted-foreground)',
                letterSpacing: '0.04em',
              }}
            >
              Verify your install:
            </p>
            <CommandBlock commands={[mainTool.tips.verify]} />

            {mainTool.tips.hello && mainTool.tips.hello.length > 0 && (
              <div className="mt-5 flex flex-col gap-2.5">
                {mainTool.tips.hello.map(h => (
                  <div key={h.cmd} className="flex items-center gap-3 flex-wrap">
                    <code
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 12,
                        color: 'var(--foreground)',
                        background: 'var(--muted)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h.cmd}
                    </code>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--muted-foreground)',
                        fontFamily: 'var(--font-jetbrains)',
                      }}
                    >
                      {h.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {mainTool.tips.cliRef && (
              <p
                className="mt-4"
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--muted-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Full CLI reference
                <Icon name="arrow" size={11} strokeWidth={2} />
                <span style={{ opacity: 0.45 }}>coming soon</span>
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
