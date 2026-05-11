"use client"

import { useState } from "react"

const API_ORIGIN = "http://localhost:8000"

export function BrowserDirectDeleteDemo() {
  const [id, setId] = useState("1")
  const [log, setLog] = useState<string>("（まだ DELETE していません）")

  async function runDelete() {
    setLog("DELETE 実行中…")
    try {
      const res = await fetch(`${API_ORIGIN}/phrases/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      const text = await res.text()
      setLog(`status=${res.status}\n\n${text}`)
    } catch (e) {
      setLog(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-3 rounded-md border p-4 text-sm">
      <p className="font-medium">ステップ5: ブラウザ直 DELETE（CORS 前提）</p>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">phrase id（整数）</span>
        <input
          className="rounded-md border bg-background px-2 py-1 font-mono"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <button
        type="button"
        className="rounded-md border border-destructive/50 bg-background px-3 py-2 hover:bg-destructive/10"
        onClick={runDelete}
      >
        DELETE /phrases/:id（削除）
      </button>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-xs">
        {log}
      </pre>
    </div>
  )
}
