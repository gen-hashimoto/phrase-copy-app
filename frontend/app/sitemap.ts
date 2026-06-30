import type { MetadataRoute } from "next"

import { siteOrigin } from "@/lib/site-origin"

export const dynamic = "force-dynamic"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteOrigin()
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}
