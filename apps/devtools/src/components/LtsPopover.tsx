'use client'

import { useState, useRef, useEffect } from 'react'

export default function LtsPopover() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="whitespace-nowrap"
        style={{
          background: 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          padding: '14px 24px',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        What is LTS?
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 300,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: -6,
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 10,
              height: 10,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRight: 'none',
              borderBottom: 'none',
            }}
          />
          <p
            style={{
              fontSize: 13,
              fontFamily: 'var(--font-jetbrains)',
              color: 'var(--foreground)',
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Long-Term Support
          </p>
          <p
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-jetbrains)',
              color: 'var(--muted-foreground)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            LTS versions receive security patches and bug fixes for an extended
            period — typically 2–3 years. They&apos;re slower-moving and more
            stable than &ldquo;Current&rdquo; releases, making them the
            recommended choice for production and everyday dev work.
          </p>
        </div>
      )}
    </div>
  )
}
