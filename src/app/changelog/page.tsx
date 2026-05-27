import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
}

export default function ChangelogPage() {
  return (
    <main className="flex flex-col flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1
          style={{
            fontFamily: 'var(--font-geist)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            margin: '0 0 8px',
            color: 'var(--foreground)',
          }}
        >
          Changelog
        </h1>
        <p
          style={{
            fontSize: 16,
            color: 'var(--foreground-dim)',
            margin: '0 0 48px',
          }}
        >
          Release history and updates for DevSetup guides.
        </p>

        <div
          style={{
            padding: '32px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)',
            textAlign: 'center',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 13,
          }}
        >
          No entries yet — check back soon.
        </div>
      </div>
    </main>
  )
}
