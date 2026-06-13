import type { Metadata } from 'next'
import { Geist, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import Icon from '@/components/Icon'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { themeBootScript } from '@/components/themeBootScript'
import './globals.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s — DevSetup',
    default: 'DevSetup — Install any dev tool correctly',
  },
  description:
    'Step-by-step install guides for Node.js, Bun, uv, Claude CLI, Codex, and more. LTS versions only. All dependencies included.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="paper"
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        {/* Apply persisted theme before hydration to avoid FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        {/* ── Header ────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50"
          style={{
            borderBottom: '1px solid var(--border-soft)',
            background: 'color-mix(in srgb, var(--background) 88%, transparent)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span
                className="flex h-8 w-8 items-center justify-center text-xs font-bold"
                style={{
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-jetbrains)',
                  letterSpacing: '-0.04em',
                }}
              >
                ›_
              </span>
              <span
                className="text-[19px] font-bold tracking-tight"
                style={{
                  fontFamily: 'var(--font-geist)',
                  color: 'var(--foreground)',
                  letterSpacing: '-0.025em',
                }}
              >
                DevSetup
              </span>
              <span
                className="ml-1 text-[11px] px-2 py-0.5 whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--muted-foreground)',
                  background: 'var(--muted)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                v1.0
              </span>
            </Link>

            <nav className="flex gap-5 items-center">
              <Link
                href="/"
                className="hidden sm:inline text-sm font-medium"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Tools
              </Link>
              <a
                className="hidden sm:inline text-sm font-medium"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Recipes
              </a>
              <a
                className="hidden sm:inline text-sm font-medium"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Changelog
              </a>

              <ThemeSwitcher />

              {/* Visual-only search hint — wire up later if you add real search */}
              <div
                className="hidden md:inline-flex items-center gap-2 whitespace-nowrap"
                style={{
                  padding: '7px 14px 7px 12px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 13,
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                <Icon name="search" size={13} strokeWidth={2} />
                search tools…
                <span
                  className="ml-1.5"
                  style={{
                    fontSize: 10,
                    border: '1px solid var(--border)',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  ⌘K
                </span>
              </div>
            </nav>
          </div>
        </header>

        {/* ── Content ───────────────────────────────────────── */}
        <div className="flex flex-1 flex-col">{children}</div>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--border-soft)' }}>
          <div
            className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between flex-wrap gap-3"
          >
            <span
              className="text-xs"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                color: 'var(--muted-foreground)',
              }}
            >
              LTS versions only · Dependencies resolved automatically
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                color: 'var(--muted-foreground)',
              }}
            >
              DevSetup
            </span>
          </div>
        </footer>
      </body>
    </html>
  )
}
