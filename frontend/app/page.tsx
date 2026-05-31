import Link from "next/link"
import { cookies } from "next/headers"

import { GuestPhraseList } from "@/components/guest-phrase-list"
import { LogoutButton } from "@/components/logout-button"
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
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium">Phrases</h1>
          </div>
          <Link className="rounded-md border px-3 py-2" href="/login">
            Login
          </Link>
        </header>
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
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium">Phrases</h1>
            <p className="text-sm text-muted-foreground">{me.email}</p>
          </div>
          <LogoutButton />
        </header>
        <p className="text-sm text-destructive">
          フレーズ一覧の取得に失敗しました: {message}
        </p>
      </main>
    )
  }

  return (
    <main className="flex min-h-svh flex-col gap-4 p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">Phrases</h1>
          <p className="text-sm text-muted-foreground">
            {me.email} / {phrases.length} 件
          </p>
        </div>
        <LogoutButton />
      </header>
      <UserPhraseList phrases={phrases} />
    </main>
  )
}
