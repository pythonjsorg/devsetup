'use client'

import { useState, useEffect, useRef } from 'react'

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
      className="relative group/block"
      style={{
        background: '#030403',
        border: '1px solid var(--border-col)',
        borderLeft: '2px solid var(--accent)',
      }}
    >
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 flex items-center gap-1.5 text-xs font-mono px-2 py-1 transition-all duration-150"
        style={{
          background: copied ? 'var(--accent)' : 'transparent',
          color: copied ? 'var(--bg)' : 'var(--muted)',
          border: `1px solid ${copied ? 'var(--accent)' : 'var(--border-col)'}`,
          fontFamily: 'var(--font-geist-mono)',
        }}
        aria-label="Copy commands to clipboard"
      >
        {copied ? '✓ copied' : 'copy'}
      </button>

      {/* Commands */}
      <div className="p-4 pr-20 flex flex-col gap-2">
        {commands.map((cmd, i) => (
          <div
            key={`${i}-${cmd}`}
            className="flex items-start gap-3 font-mono text-sm"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            <span
              className="shrink-0 select-none mt-px"
              style={{ color: 'var(--accent)', opacity: 0.6 }}
            >
              $
            </span>
            <span style={{ color: '#c8ffa0', wordBreak: 'break-all' }}>{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
