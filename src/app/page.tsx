import { getAllTools } from '@/lib/catalog'
import ToolCard from '@/components/ToolCard'

export default function HomePage() {
  const tools = getAllTools()

  return (
    <main className="flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-950">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            DevSetup
          </h1>
          <p className="mt-4 text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            Install any dev tool correctly, once.{' '}
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">LTS versions only.</span>{' '}
            Dependencies included.
          </p>
        </div>
      </section>

      {/* Tool grid */}
      <section className="mx-auto w-full max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Available tools
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  )
}
