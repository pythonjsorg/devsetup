import { MetadataRoute } from 'next'
import { getAllTools } from '@/lib/catalog'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools()
  const baseUrl = 'https://pythonjs.org/devtools'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...tools.map(tool => ({
      url: `${baseUrl}/tools/${tool.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
