"use client"

import { useState } from "react"

const API_ORIGIN = "http://localhost:8000"

export function BrowserDirectPostDemo() {
  const [title, setTitle] = useState("demo title")
  const [content, setContent] = useState("demo content")
  const [log, setLog] = useState<string>("（まだ POST していません）")

  async function runPost() {
    setLog("POST 実行中…")
    try {
      const res = await fetch(`${API_ORIGIN}/phrases`, {
        method: "POST",
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
      <p className="font-medium">ステップ3: ブラウザ直 POST（CORS 前提）</p>
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
        onClick={runPost}
      >
        POST /phrases（作成）
      </button>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-xs">
        {log}
      </pre>
    </div>
  )
}
