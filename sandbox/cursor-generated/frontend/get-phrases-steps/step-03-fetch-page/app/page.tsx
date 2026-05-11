import type { PhraseRead } from "@/types/phrase"

function apiOrigin(): string {
  const base = process.env.API_BASE_URL
  if (!base) {
    throw new Error("環境変数 API_BASE_URL が未設定です。.env.local を確認してください。")
  }
  return base.replace(/\/$/, "")
}

async function fetchPhrases(): Promise<PhraseRead[]> {
  const res = await fetch(`${apiOrigin()}/phrases`, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`GET /phrases が失敗しました (${res.status} ${res.statusText})`)
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
        <p className="text-destructive text-sm">{message}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col gap-4 p-6">
      <header>
        <h1 className="text-lg font-medium">Phrases</h1>
        <p className="text-muted-foreground text-sm">{phrases.length} 件</p>
      </header>

      {phrases.length === 0 ? (
        <p className="text-muted-foreground text-sm">フレーズがありません。</p>
      ) : (
        <ul className="flex max-w-lg flex-col gap-3 text-sm">
          {phrases.map((p) => (
            <li
              key={p.id}
              className="border-border rounded-md border px-3 py-2 leading-relaxed"
            >
              <div className="font-medium">{p.title}</div>
              <div className="text-muted-foreground mt-1 whitespace-pre-wrap">{p.content}</div>
              <div className="text-muted-foreground mt-2 text-xs">
                {new Date(p.created_at).toLocaleString("ja-JP")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
