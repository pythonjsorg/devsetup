import { getTool, getAllTools, resolveDeps } from '@/lib/catalog'
import type { InstallMethods } from '@/data/tools'
import InstallGuide from '@/components/InstallGuide'
import ToolInfo from '@/components/ToolInfo'

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
  const title = `Install ${tool.name} on macOS, Windows & Linux`
  const description = `Step-by-step ${tool.name} install guide. ${
    tool.lts ? 'LTS ' + tool.lts.version + ' only.' : 'Latest stable.'
  } All dependencies included.`
  return {
    title,
    description,
    alternates: { canonical: `/devtools/tools/${toolId}` },
    openGraph: { title, description, url: `/devtools/tools/${toolId}` },
    twitter: { title, description },
  }
}

function primaryCommands(m: InstallMethods): string[] {
  return m.homebrew ?? m.apt ?? m.curl ?? m.winget ?? m.nvm ?? m.manual ?? []
}

export default async function InstallPage({
  params,
}: {
  params: Promise<{ tool: string }>
}) {
  const { tool: toolId } = await params
  const tool = getTool(toolId)
  const steps = resolveDeps(toolId)

  const osSections = (
    [
      { name: 'macOS', cmds: primaryCommands(tool.install.macos) },
      { name: 'Linux', cmds: primaryCommands(tool.install.linux) },
      { name: 'Windows', cmds: primaryCommands(tool.install.windows) },
    ] as const
  ).filter(s => s.cmds.length > 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Install ${tool.name}`,
    description: tool.description,
    step: osSections.map(s => ({
      '@type': 'HowToSection',
      name: s.name,
      itemListElement: s.cmds.map((cmd, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text: cmd,
      })),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InstallGuide steps={steps} />
      {tool.content && <ToolInfo tool={tool} />}
    </>
  )
}
