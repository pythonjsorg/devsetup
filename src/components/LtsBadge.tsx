type Props = { version: string; label: string }

export default function LtsBadge({ version, label }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/30"
      title="We pin to LTS for security. This version receives patches for 30 months."
    >
      LTS v{version} &middot; 30-month support
    </span>
  )
}
