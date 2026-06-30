const DEFAULT_ORIGIN = "http://localhost:3000"

/** sitemap / robots / metadataBase 用の公開 URL ベース */
export function siteOrigin(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_ORIGIN ?? process.env.APP_ORIGIN
  return (fromEnv ?? DEFAULT_ORIGIN).replace(/\/$/, "")
}
