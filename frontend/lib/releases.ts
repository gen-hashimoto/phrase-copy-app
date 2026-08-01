export const APP_VERSION = "1.0.0"

export type ReleaseSection = {
  title: string
  items: string[]
}

export type Release = {
  /** URL segment and heading, e.g. "v1.0.0" */
  version: string
  /** ISO date string, e.g. "2026-07-29" */
  date: string
  /** Short bullets for the /releases index */
  highlights: string[]
  /** Detailed sections for /releases/[version] */
  sections: ReleaseSection[]
}

export const releases: Release[] = [
  {
    version: "v1.0.0",
    date: "2026-07-29",
    highlights: [
      "Initial public release",
      "Magic Link authentication",
      "Resend support",
    ],
    sections: [
      {
        title: "Added",
        items: ["Passwordless authentication", "Email delivery via Resend"],
      },
      {
        title: "Improved",
        items: ["Mail provider abstraction", "Docker deployment"],
      },
      {
        title: "Infrastructure",
        items: ["HTTPS", "AWS EC2"],
      },
    ],
  },
]

export function getRelease(versionParam: string): Release | undefined {
  const normalized = versionParam.startsWith("v")
    ? versionParam
    : `v${versionParam}`
  return releases.find((r) => r.version === normalized)
}
