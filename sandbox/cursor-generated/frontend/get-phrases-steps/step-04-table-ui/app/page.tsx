import type { PhraseRead } from "@/types/phrase"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
        <Table>
          <TableCaption>GET /phrases の一覧</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">ID</TableHead>
              <TableHead className="min-w-32">タイトル</TableHead>
              <TableHead>内容</TableHead>
              <TableHead className="w-44">作成日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phrases.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground max-w-md whitespace-normal">
                  {p.content}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-normal">
                  {new Date(p.created_at).toLocaleString("ja-JP")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
