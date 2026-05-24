import { GuestPhraseList } from "@/components/guest-phrase-list"
import { UserPhraseList } from "@/components/user-phrase-list"
import { serverAppOrigin } from "@/lib/server-app-origin"
import type { PhraseRead } from "@/types/phrase"
import type { User } from "@/types/user"

async function fetchMe(): Promise<User | null> {
  const origin = await serverAppOrigin()
  const res = await fetch(`${origin}/api/auth/me`, {
    cache: "no-store",
    credentials: "include",
  })
  if (res.status === 401) return null
  if (!res.ok) throw Error("error")
  return res.json().then((data) => data.user)
}

async function fetchPhrases(): Promise<PhraseRead[]> {
  const origin = await serverAppOrigin()
  const res = await fetch(`${origin}/api/phrases`, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(
      `GET /api/phrases が失敗しました (${res.status} ${res.statusText})`
    )
  }
  return res.json()
}

export default async function Page() {
  // before login
  const me = await fetchMe()
  if (me === null) {
    return (
      <div className="flex min-h-svh flex-col gap-4 p-6">
        <header>
          <h1 className="text-lg font-medium">Phrases</h1>
        </header>
        <GuestPhraseList />
      </div>
    )
  }

  let phrases: PhraseRead[]

  try {
    phrases = await fetchPhrases()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return (
      <div className="flex min-h-svh flex-col gap-2 p-6">
        <h1 className="text-lg font-medium">Phrases</h1>
        <p className="text-sm text-destructive">{message}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <header>
        <h1 className="text-lg font-medium">Phrases</h1>
        <p className="text-sm text-muted-foreground">{phrases.length} 件</p>
      </header>

      <UserPhraseList phrases={phrases} />
    </div>
  )
}
