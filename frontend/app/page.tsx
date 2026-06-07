import { cookies } from "next/headers"

import { HeaderTheme } from "@/components/header-theme"
import { GuestPhraseList } from "@/components/guest-phrase-list"
import { UserPhraseList } from "@/components/user-phrase-list"
import { serverAppOrigin } from "@/lib/server-app-origin"
import type { PhraseRead } from "@/types/phrase"
import type { User } from "@/types/user"

async function cookieHeaderFromRequest(): Promise<string> {
  return cookies().then((cookieStore) => cookieStore.toString())
}

async function fetchMe(): Promise<User | null> {
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

async function fetchPhrases(): Promise<PhraseRead[]> {
  const origin = await serverAppOrigin()
  const cookie = await cookieHeaderFromRequest()
  const res = await fetch(`${origin}/api/phrases`, {
    cache: "no-store",
    headers: { cookie },
  })
  if (!res.ok) {
    throw new Error(`GET /api/phrases failed (${res.status} ${res.statusText})`)
  }
  return res.json()
}

export default async function Page() {
  // before login
  const me = await fetchMe()
  if (me === null) {
    return (
      <main className="flex min-h-svh flex-col gap-4 p-6">
        <HeaderTheme userEmail={null} />
        <GuestPhraseList />
      </main>
    )
  }

  let phrases: PhraseRead[]

  try {
    phrases = await fetchPhrases()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return (
      <main className="flex min-h-svh flex-col gap-4 p-6">
        <HeaderTheme userEmail={me.email} />
        <p className="text-sm text-destructive">
          フレーズ一覧の取得に失敗しました: {message}
        </p>
      </main>
    )
  }

  return (
    <main className="flex min-h-svh flex-col gap-4 p-6">
      <HeaderTheme userEmail={me.email} />
      <UserPhraseList phrases={phrases} />
    </main>
  )
}
