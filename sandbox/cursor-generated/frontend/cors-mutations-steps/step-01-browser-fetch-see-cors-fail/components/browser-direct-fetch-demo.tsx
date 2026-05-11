"use client"

import { useState } from "react"

const API_ORIGIN = "http://localhost:8000"

/**
 * 学習用: ブラウザからバックエンドへ直接 fetch する。
 * FastAPI に CORSMiddleware が無いと CORS で失敗する（ステップ1の教材）。
 */
export function BrowserDirectFetchDemo() {
  const [log, setLog] = useState<string>("（まだ実行していません）")

  async function runGetPhrases() {
    setLog("実行中…")
    try {
      const res = await fetch(`${API_ORIGIN}/phrases`, {
        method: "GET",
        cache: "no-store",
      })
      const text = await res.text()
      setLog(`status=${res.status}\n\n${text.slice(0, 500)}${text.length > 500 ? "…" : ""}`)
    } catch (e) {
      setLog(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-3 rounded-md border p-4 text-sm">
      <p className="font-medium">ステップ1: ブラウザ直 fetch（CORS 教材）</p>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Next は <code className="rounded bg-muted px-1">localhost:3000</code>
        、API は <code className="rounded bg-muted px-1">localhost:8000</code>
        。オリジンが違うので、ブラウザ経由の fetch には CORS が必要。
      </p>
      <button
        type="button"
        className="rounded-md border bg-background px-3 py-2 text-left hover:bg-muted/50"
        onClick={runGetPhrases}
      >
        GET /phrases をブラウザから実行
      </button>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-xs">
        {log}
      </pre>
    </div>
  )
}
