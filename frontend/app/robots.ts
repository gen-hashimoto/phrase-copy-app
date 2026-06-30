import type { MetadataRoute } from "next"

import { siteOrigin } from "@/lib/site-origin"

export const dynamic = "force-dynamic"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteOrigin()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/login/sent", "/auth/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
