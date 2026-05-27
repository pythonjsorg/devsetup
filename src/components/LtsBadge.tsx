type Props = { version: string; label?: string }

export default function LtsBadge({ version }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap"
      title="Pinned to LTS. This version receives security patches for 30 months."
      style={{
        padding: '3px 10px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        color: 'var(--cat-pkg-fg)',
        background: 'var(--cat-pkg-bg)',
        borderRadius: 'var(--radius-full)',
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
      LTS v{version}
    </span>
  )
}
