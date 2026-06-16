import type { User } from "@/types/user"
import { apiOrigin } from "@/lib/api-origin"
import { cookieHeaderFromRequest } from "@/lib/cookie-header-from-request"

export async function fetchMe(): Promise<User | null> {
  const cookie = await cookieHeaderFromRequest()
  const res = await fetch(`${apiOrigin()}/auth/me`, {
    cache: "no-store",
    headers: { cookie },
  })

  if (res.status === 401) return null
  if (!res.ok) {
    throw new Error(`GET /auth/me failed (${res.status} ${res.statusText})`)
  }

  const data = await res.json()
  return data.user
}
