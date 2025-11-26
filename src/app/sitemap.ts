import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { allDocs } from "@/contentlayer/generated"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  const docsEntries = allDocs.map((doc) => ({
    url: new URL(doc.slug, baseUrl).toString(),
    lastModified: new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
    },
    ...docsEntries,
  ]
}
