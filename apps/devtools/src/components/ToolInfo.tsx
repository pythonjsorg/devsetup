import Link from 'next/link'
import type { Tool } from '@/data/tools'
import { getAllTools } from '@/lib/catalog'

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--primary)',
          fontFamily: 'var(--font-jetbrains)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div className="flex-1" style={{ height: 1, background: 'var(--border-soft)' }} />
    </div>
  )
}

export default function ToolInfo({ tool }: { tool: Tool }) {
  if (!tool.content) return null

  // Same category, excluding self — enforced by code, not manual lists
  const related = getAllTools().filter(
    t => t.category === tool.category && t.id !== tool.id,
  )

  const { about, comparisons } = tool.content

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-16 flex flex-col gap-8">

      {/* About */}
      <section>
        <SectionHeader label="About" />
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
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: 'var(--foreground)',
              fontFamily: 'var(--font-geist)',
              margin: 0,
            }}
          >
            {about}
          </p>
        </div>
      </section>

      {/* Compare */}
      {comparisons && comparisons.length > 0 && (
        <section>
          <SectionHeader label="Compare" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comparisons.map(c => (
              <div
                key={c.slug}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-jetbrains)',
                    color: 'var(--foreground)',
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-foreground)',
                    background: 'var(--muted)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    whiteSpace: 'nowrap',
                    opacity: 0.7,
                  }}
                >
                  soon
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related tools — same category, derived automatically */}
      {related.length > 0 && (
        <section>
          <SectionHeader label="Related tools" />
          <div className="flex flex-wrap gap-2">
            {related.map(t => (
              <Link
                key={t.id}
                href={`/tools/${t.id}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--foreground)',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '7px 16px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {t.name}
                <span style={{ opacity: 0.4, fontSize: 11 }}>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
