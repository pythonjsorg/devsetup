import { getTool, getAllTools, resolveDeps } from '@/lib/catalog'
import InstallGuide from '@/components/InstallGuide'

export async function generateStaticParams() {
  return getAllTools().map(t => ({ tool: t.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>
}) {
  const { tool: toolId } = await params
  const tool = getTool(toolId)
  return {
    title: `Install ${tool.name} on macOS, Windows & Linux`,
    description: `Step-by-step ${tool.name} install guide. ${
      tool.lts ? 'LTS ' + tool.lts.version + ' only.' : 'Latest stable.'
    } All dependencies included.`,
  }
}

export default async function InstallPage({
  params,
}: {
  params: Promise<{ tool: string }>
}) {
  const { tool: toolId } = await params
  const steps = resolveDeps(toolId)
  return <InstallGuide steps={steps} />
}
