import { getAllTools } from '@/lib/catalog'
import ToolCard from '@/components/ToolCard'

export default function HomePage() {
  const tools = getAllTools()

  return (
    <main className="flex flex-col flex-1">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ borderBottom: '1px solid var(--border-col)' }}
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(var(--border-col) 1px, transparent 1px),
              linear-gradient(90deg, var(--border-col) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            opacity: 0.4,
          }}
        />
        {/* Accent glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-px flex-1 max-w-12"
              style={{ background: 'var(--accent)' }}
            />
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono)' }}
            >
              Developer toolkit
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="font-extrabold leading-none tracking-tight mb-6"
            style={{
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              color: 'var(--fg)',
              letterSpacing: '-0.03em',
            }}
          >
            Dev
            <span style={{ color: 'var(--accent)' }}>Setup</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: 'var(--fg-dim)' }}
          >
            Install any dev tool correctly, once.{' '}
            <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>LTS versions only.</strong>{' '}
            All dependencies resolved for you — step by step.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: 'Tools', value: `${tools.length}` },
              { label: 'Platforms', value: '3' },
              { label: 'LTS enforced', value: '100%' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-bold"
                  style={{ color: 'var(--accent)' }}
                >
                  {value}
                </span>
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--muted)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section className="mx-auto w-full max-w-5xl px-6 py-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)' }}
          >
            Available tools
          </span>
          <div
            className="h-px flex-1"
            style={{ background: 'var(--border-col)' }}
          />
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  )
}
