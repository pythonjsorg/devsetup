type Props = { version: string; label: string }

export default function LtsBadge({ version, label: _label }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono"
      style={{
        background: 'rgba(200,250,0,0.08)',
        border: '1px solid rgba(200,250,0,0.25)',
        color: 'var(--accent)',
        fontFamily: 'var(--font-geist-mono)',
        letterSpacing: '0.03em',
      }}
      title="Pinned to LTS. This version receives security patches for 30 months."
    >
      <span style={{ opacity: 0.6 }}>■</span>
      LTS v{version} · 30-mo
    </span>
  )
}
