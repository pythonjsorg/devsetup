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
      // clipboard write failed silently (permission denied, insecure context, etc.)
    }
  }

  return (
    <div className="relative rounded-lg bg-zinc-900 px-5 py-4 font-mono text-sm text-zinc-100">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded px-2 py-1 text-xs font-sans font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
        aria-label="Copy commands to clipboard"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div className="flex flex-col gap-1 pr-14">
        {commands.map((cmd, i) => (
          <div key={`${i}-${cmd}`} className="flex gap-2">
            <span className="select-none text-zinc-500">$</span>
            <span>{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
