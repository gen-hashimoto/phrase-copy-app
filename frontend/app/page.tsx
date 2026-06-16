import { AppShellServer } from "@/components/app-shell-server"
import { GuestPhraseList } from "@/components/guest-phrase-list"
import { FreeUserPhraseList } from "@/components/free-user-phrase-list"
import { apiOrigin } from "@/lib/api-origin"
import { cookieHeaderFromRequest } from "@/lib/cookie-header-from-request"
import { fetchMe } from "@/lib/fetch-me"
import type { PhraseRead } from "@/types/phrase"

async function fetchPhrases(): Promise<PhraseRead[]> {
  const cookie = await cookieHeaderFromRequest()
  const res = await fetch(`${apiOrigin()}/phrases`, {
    cache: "no-store",
    headers: { cookie },
  })
  if (!res.ok) {
    throw new Error(`GET /api/phrases failed (${res.status} ${res.statusText})`)
  }
  return res.json()
}

export default async function Page() {
  const me = await fetchMe()

  // before login
  if (me === null) {
    return (
      <AppShellServer user={null} showLoginButton={true}>
        <GuestPhraseList />
      </AppShellServer>
    )
  }

  let phrases: PhraseRead[]

  try {
    phrases = await fetchPhrases()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return (
      <AppShellServer user={me} showLoginButton={true}>
        <p className="text-sm text-destructive">
          フレーズ一覧の取得に失敗しました: {message}
        </p>
      </AppShellServer>
    )
  }

  return (
    <AppShellServer user={me} showLoginButton={true}>
      <FreeUserPhraseList phrases={phrases} />
    </AppShellServer>
  )
}
