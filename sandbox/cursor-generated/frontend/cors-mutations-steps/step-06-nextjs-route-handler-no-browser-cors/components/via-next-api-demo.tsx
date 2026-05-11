"use client"

import { useState } from "react"

/**
 * 学習用: ブラウザは常に同じオリジンの /api/* だけを叩く。
 * FastAPI への通信は Route Handler 側（サーバー）が担当する。
 */
export function ViaNextApiDemo() {
  const [log, setLog] = useState<string>("（まだ /api を叩いていません）")

  async function runGet() {
    setLog("GET /api/phrases …")
    try {
      const res = await fetch("/api/phrases", { cache: "no-store" })
      const text = await res.text()
      setLog(`status=${res.status}\n\n${text.slice(0, 1200)}${text.length > 1200 ? "…" : ""}`)
    } catch (e) {
      setLog(e instanceof Error ? e.message : String(e))
    }
  }

  async function runPost() {
    setLog("POST /api/phrases …")
    try {
      const res = await fetch("/api/phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "via next", content: "created via /api" }),
      })
      const text = await res.text()
      setLog(`status=${res.status}\n\n${text}`)
    } catch (e) {
      setLog(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-3 rounded-md border p-4 text-sm">
      <p className="font-medium">ステップ6: 同じオリジンの /api 経由（CORS 教材）</p>
      <p className="text-muted-foreground text-xs leading-relaxed">
        <code className="rounded bg-muted px-1">fetch(&quot;/api/phrases&quot;)</code> は
        ブラウザから見て <strong>localhost:3000 同士</strong>。FastAPI の CORS は不要（サーバー→8000
        は別問題）。
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border bg-background px-3 py-2 hover:bg-muted/50"
          onClick={runGet}
        >
          GET /api/phrases
        </button>
        <button
          type="button"
          className="rounded-md border bg-background px-3 py-2 hover:bg-muted/50"
          onClick={runPost}
        >
          POST /api/phrases
        </button>
      </div>
      <PutDeleteSection setLog={setLog} />
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-xs">
        {log}
      </pre>
    </div>
  )
}

function PutDeleteSection({ setLog }: { setLog: (s: string) => void }) {
  const [id, setId] = useState("1")

  async function runPut() {
    setLog("PUT /api/phrases/:id …")
    try {
      const res = await fetch(`/api/phrases/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "via next put", content: "updated via /api" }),
      })
      const text = await res.text()
      setLog(`status=${res.status}\n\n${text}`)
    } catch (e) {
      setLog(e instanceof Error ? e.message : String(e))
    }
  }

  async function runDelete() {
    setLog("DELETE /api/phrases/:id …")
    try {
      const res = await fetch(`/api/phrases/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      const text = await res.text()
      setLog(`status=${res.status}\n\n${text}`)
    } catch (e) {
      setLog(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t pt-3">
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">phrase id</span>
        <input
          className="rounded-md border bg-background px-2 py-1 font-mono"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border bg-background px-3 py-2 hover:bg-muted/50"
          onClick={runPut}
        >
          PUT /api/phrases/:id
        </button>
        <button
          type="button"
          className="rounded-md border border-destructive/50 bg-background px-3 py-2 hover:bg-destructive/10"
          onClick={runDelete}
        >
          DELETE /api/phrases/:id
        </button>
      </div>
    </div>
  )
}
