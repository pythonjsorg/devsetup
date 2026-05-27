import { getAllTools } from '@/lib/catalog'
import FilterableGrid from '@/components/FilterableGrid'
import Icon from '@/components/Icon'

export default function HomePage() {
  const tools = getAllTools()

  return (
    <main className="flex flex-col flex-1">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 grid lg:grid-cols-[1.3fr_1fr] gap-16 items-center">
          {/* Left column */}
          <div>
            {/* Status pill */}
            <div
              className="inline-flex items-center gap-2.5 whitespace-nowrap mb-7"
              style={{
                padding: '5px 5px 5px 14px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontFamily: 'var(--font-jetbrains)',
                color: 'var(--foreground-dim)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--cat-pkg-fg)',
                  boxShadow: '0 0 0 4px var(--cat-pkg-bg)',
                }}
              />
              All guides verified · updated weekly
              <span
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                }}
              >
                v1.0
              </span>
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: 'clamp(2.75rem, 7vw, 5rem)',
                fontWeight: 700,
                lineHeight: 0.96,
                letterSpacing: '-0.04em',
                margin: 0,
                color: 'var(--foreground)',
                textWrap: 'balance',
              }}
            >
              Install any dev tool,{' '}
              <em
                style={{
                  fontFamily: 'var(--font-instrument-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                correctly
              </em>
              .
            </h1>

            {/* Sub */}
            <p
              className="mt-5 max-w-xl"
              style={{
                fontSize: 18,
                lineHeight: 1.55,
                color: 'var(--foreground-dim)',
                textWrap: 'pretty',
              }}
            >
              Step-by-step recipes for Node, Bun, uv, and the new generation of
              terminal AI agents. Pinned to LTS, every dependency taken care of —
              no copy-pasting from five Stack Overflow tabs.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex gap-3 items-center flex-wrap">
              <a
                href="#tools"
                className="inline-flex items-center gap-2 whitespace-nowrap"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '15px 28px',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-lg)',
                  textDecoration: 'none',
                }}
              >
                Browse tools
                <Icon name="arrow" size={15} strokeWidth={2.25} />
              </a>
              <a
                href="https://nodejs.org/en/about/previous-releases"
                target="_blank"
                rel="noopener noreferrer"
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
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                What is LTS?
              </a>
            </div>

            {/* Stat strip */}
            <div
              className="mt-10 pt-5 flex gap-10 flex-wrap"
              style={{ borderTop: '1px solid var(--border-soft)' }}
            >
              {[
                { v: String(tools.length), l: 'Tools indexed' },
                { v: '3', l: 'Platforms' },
                { v: '100%', l: 'LTS-pinned' },
                { v: '2', l: 'AI agents' },
              ].map(stat => (
                <div key={stat.l}>
                  <div
                    style={{
                      fontFamily: 'var(--font-geist)',
                      fontSize: 26,
                      fontWeight: 700,
                      color: 'var(--foreground)',
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {stat.v}
                  </div>
                  <div
                    className="mt-1.5"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--muted-foreground)',
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                  >
                    {stat.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — preview card */}
          <div
            className="hidden lg:block"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-2xl)',
              overflow: 'hidden',
              transform: 'rotate(0.4deg)',
            }}
          >
            <div
              className="flex items-center gap-2.5"
              style={{
                padding: '14px 18px',
                background: 'var(--surface-2)',
                borderBottom: '1px solid var(--border-soft)',
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 11,
                color: 'var(--muted-foreground)',
                letterSpacing: '0.04em',
              }}
            >
              <span className="flex gap-1.5">
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
              </span>
              <span className="ml-1.5">~/dev/setup/node</span>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-3.5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    background: 'var(--cat-runtime-bg)',
                    color: 'var(--cat-runtime-fg)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <Icon name="bolt" size={22} strokeWidth={2} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-geist)',
                      fontWeight: 700,
                      fontSize: 22,
                      letterSpacing: '-0.025em',
                      lineHeight: 1.05,
                      color: 'var(--foreground)',
                    }}
                  >
                    Node.js
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 mt-1.5 whitespace-nowrap"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      color: 'var(--cat-pkg-fg)',
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--cat-pkg-fg)',
                      }}
                    />
                    LTS v22.x · &ldquo;Jod&rdquo; · 30-mo support
                  </div>
                </div>
              </div>

              <p
                className="mb-3.5"
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: 'var(--foreground-dim)',
                  margin: '0 0 14px',
                }}
              >
                JavaScript runtime built on Chrome&rsquo;s V8. Required for npm, npx,
                and most JS-based CLIs.
              </p>

              <div
                className="relative"
                style={{
                  background: 'var(--code-bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 13,
                  color: 'var(--code-fg)',
                  lineHeight: 1.6,
                }}
              >
                <div>
                  <span style={{ color: 'var(--code-prompt)', marginRight: 10 }}>$</span>
                  brew install node@22
                </div>
              </div>

              <div
                className="mt-3.5 flex justify-between items-center"
                style={{
                  fontSize: 12,
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-jetbrains)',
                }}
              >
                <span>3 steps · ~2 min</span>
                <span
                  className="inline-flex items-center gap-1 whitespace-nowrap"
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  open recipe
                  <Icon name="arrow" size={12} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FilterableGrid tools={tools} />
    </main>
  )
}
