'use client'

import { useState, useEffect, useRef } from 'react'
import Icon from '@/components/Icon'

type Props = { commands: string[] }

export default function CommandBlock({ commands }: Props) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (commands.length === 0) return null

  async function handleCopy() {
    if (!navigator.clipboard) return
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    try {
      await navigator.clipboard.writeText(commands.join('\n'))
      setCopied(true)
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 2000)
    } catch {
      // clipboard write failed silently
    }
  }

  return (
    <div
      className="relative"
      style={{
        background: 'var(--code-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        fontFamily: 'var(--font-jetbrains)',
        fontSize: 13.5,
        lineHeight: 1.65,
        color: 'var(--code-fg)',
      }}
    >
      <button
        onClick={handleCopy}
        aria-label="Copy commands to clipboard"
        className="absolute top-3 right-3 inline-flex items-center gap-1.5"
        style={{
          background: copied
            ? 'var(--code-prompt)'
            : 'transparent',
          color: copied ? 'var(--code-bg)' : 'var(--code-fg)',
          border: copied
            ? '1px solid var(--code-prompt)'
            : '1px solid rgba(255,255,255,0.18)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 11,
          padding: '4px 10px',
          cursor: 'pointer',
          fontFamily: 'var(--font-jetbrains)',
          letterSpacing: '0.04em',
          opacity: copied ? 1 : 0.85,
          transition: 'opacity 120ms, background 120ms, color 120ms',
        }}
      >
        <Icon name={copied ? 'check' : 'copy'} size={11} strokeWidth={2.25} />
        {copied ? 'copied' : 'copy'}
      </button>

      <div className="flex flex-col gap-1 pr-20">
        {commands.map((cmd, i) => (
          <div
            key={`${i}-${cmd}`}
            className="flex items-start gap-3"
          >
            <span
              className="shrink-0 select-none"
              style={{ color: 'var(--code-prompt)' }}
            >
              $
            </span>
            <span style={{ wordBreak: 'break-all' }}>{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
