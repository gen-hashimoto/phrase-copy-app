"use client"

import { useState } from "react"

const API_ORIGIN = "http://localhost:8000"

export function BrowserDirectPutDemo() {
  const [id, setId] = useState("1")
  const [title, setTitle] = useState("updated title")
  const [content, setContent] = useState("updated content")
  const [log, setLog] = useState<string>("（まだ PUT していません）")

  async function runPut() {
    setLog("PUT 実行中…")
    try {
      const res = await fetch(`${API_ORIGIN}/phrases/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      const text = await res.text()
      setLog(`status=${res.status}\n\n${text}`)
    } catch (e) {
      setLog(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-3 rounded-md border p-4 text-sm">
      <p className="font-medium">ステップ4: ブラウザ直 PUT（CORS 前提）</p>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">phrase id（整数）</span>
        <input
          className="rounded-md border bg-background px-2 py-1 font-mono"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">title</span>
        <input
          className="rounded-md border bg-background px-2 py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">content</span>
        <textarea
          className="min-h-20 rounded-md border bg-background px-2 py-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <button
        type="button"
        className="rounded-md border bg-background px-3 py-2 hover:bg-muted/50"
        onClick={runPut}
      >
        PUT /phrases/:id（更新）
      </button>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-xs">
        {log}
      </pre>
    </div>
  )
}
