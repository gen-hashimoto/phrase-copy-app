import { headers } from "next/headers"

/** Server Component から同じアプリの Route Handler を絶対 URL で叩くとき用 */
export async function serverAppOrigin(): Promise<string> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  if (!host) {
    throw new Error("Host ヘッダが取得できません。")
  }
  const proto = h.get("x-forwarded-proto") ?? "http"
  return `${proto}://${host}`
}
