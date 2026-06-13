import type { Metadata } from 'next'
import { Geist, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import SearchBar from '@/components/SearchBar'
import MobileSearch from '@/components/MobileSearch'
import MobileNav from '@/components/MobileNav'
import { themeBootScript } from '@/components/themeBootScript'
import { SpeedInsights } from '@vercel/speed-insights/next'
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

const SITE_URL = 'https://pythonjs.org'
const ZONE_PATH = '/devtools' // this app is the /devtools Multi-Zone

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: ZONE_PATH },
  title: {
    template: '%s — DevSetup',
    default: 'DevSetup — Install any dev tool correctly',
  },
  description:
    'Step-by-step install guides for Node.js, Bun, Docker, Git, and more. LTS pinned where applicable, every dependency resolved automatically.',
  openGraph: {
    type: 'website',
    siteName: 'DevSetup',
    url: ZONE_PATH,
    title: 'DevSetup — Install any dev tool correctly',
    description:
      'Step-by-step install guides for Node.js, Bun, Docker, Git, and more. LTS pinned where applicable, every dependency resolved automatically.',
  },
  twitter: {
    card: 'summary',
    title: 'DevSetup — Install any dev tool correctly',
    description:
      'Step-by-step install guides for Node.js, Bun, Docker, Git, and more.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="paper"
      suppressHydrationWarning
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        {/* suppressHydrationWarning: boot script updates this before React hydrates */}
        <meta name="theme-color" content="#f4ede0" suppressHydrationWarning />
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

            <nav className="flex items-center gap-2">
              {/* Install — active */}
              <Link
                href="/"
                className="hidden md:inline-flex items-center whitespace-nowrap"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--foreground)',
                  background: 'var(--muted)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  textDecoration: 'none',
                }}
              >
                Install
              </Link>

              {/* DB Commands — soon */}
              <span
                className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--muted-foreground)',
                  padding: '5px 12px',
                  cursor: 'default',
                }}
              >
                <span style={{ opacity: 0.55 }}>DB Cmds</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-foreground)',
                    background: 'var(--muted)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  soon
                </span>
              </span>

              {/* CLI Ref — soon */}
              <span
                className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--muted-foreground)',
                  padding: '5px 12px',
                  cursor: 'default',
                }}
              >
                <span style={{ opacity: 0.55 }}>CLI Ref</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-foreground)',
                    background: 'var(--muted)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  soon
                </span>
              </span>

              {/* Compare — soon */}
              <span
                className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--muted-foreground)',
                  padding: '5px 12px',
                  cursor: 'default',
                }}
              >
                <span style={{ opacity: 0.55 }}>Compare</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-foreground)',
                    background: 'var(--muted)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  soon
                </span>
              </span>

              <div className="hidden md:block">
                <ThemeSwitcher />
              </div>
              <SearchBar />
              <MobileSearch />
              <MobileNav />
            </nav>
          </div>
        </header>

        {/* ── Content ───────────────────────────────────────── */}
        <div className="flex flex-1 flex-col">{children}</div>

        <SpeedInsights />

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
              LTS where applicable · Dependencies resolved automatically
            </span>
            <div className="flex items-center gap-4">
              <Link
                href="/changelog"
                className="text-xs"
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--muted-foreground)',
                  textDecoration: 'none',
                }}
              >
                Changelog
              </Link>
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
          </div>
        </footer>
      </body>
    </html>
  )
}
