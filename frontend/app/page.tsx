import { PhraseManager } from "@/components/phrase-manager"
import { serverAppOrigin } from "@/lib/server-app-origin"
import type { PhraseRead } from "@/types/phrase"

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

      <PhraseManager phrases={phrases} />
    </div>
  )
}
