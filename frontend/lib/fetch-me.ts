import type { User } from "@/types/user"
import { serverAppOrigin } from "@/lib/server-app-origin"
import { cookieHeaderFromRequest } from "@/lib/cookie-header-from-request"

export async function fetchMe(): Promise<User | null> {
  const origin = await serverAppOrigin()
  const cookie = await cookieHeaderFromRequest()
  const res = await fetch(`${origin}/api/auth/me`, {
    cache: "no-store",
    headers: { cookie },
  })

  if (res.status === 401) return null
  if (!res.ok) {
    throw new Error(`GET /api/auth/me failed (${res.status} ${res.statusText})`)
  }

  const data = await res.json()
  return data.user
}
