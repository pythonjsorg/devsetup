import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-7xl font-bold text-zinc-200 dark:text-zinc-800 select-none">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        This tool or page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Browse all tools →
      </Link>
    </main>
  )
}
