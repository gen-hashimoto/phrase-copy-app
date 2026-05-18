"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition, type SubmitEvent } from "react"

import type { PhraseRead } from "@/types/phrase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableCell, TableRow } from "@/components/ui/table"
import { PhraseTableShell } from "@/components/phrase-table-shell"
import { cn } from "@/lib/utils"
import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { getPhraseCopyText } from "@/lib/phrase-copy-text"
import { useCopiedFeedback } from "@/hooks/use-copied-feedback"
import { joinPhrasesForCopyAll } from "@/lib/join-phrases-for-copy-all"
import { PhraseDisplayRow } from "./phrase-display-row"

const fieldClass =
  "border-input bg-background w-full min-w-0 rounded-md border px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"

type PhraseManagerProps = {
  phrases: PhraseRead[]
}

export function PhraseManager({ phrases }: PhraseManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [banner, setBanner] = useState<string | null>(null)

  const [createTitle, setCreateTitle] = useState("")
  const [createContent, setCreateContent] = useState("")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const { showCopied, isCopied } = useCopiedFeedback()

  function refreshList() {
    startTransition(() => {
      router.refresh()
    })
  }

  async function handleCreate(e: SubmitEvent) {
    e.preventDefault()
    setBanner(null)
    const res = await fetch("/api/phrases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: createTitle, content: createContent }),
    })
    if (!res.ok) {
      const text = await res.text()
      setBanner(`作成に失敗しました (${res.status}): ${text}`)
      return
    }
    setCreateTitle("")
    setCreateContent("")
    setBanner("作成しました。")
    refreshList()
  }

  const startEdit = useCallback((p: PhraseRead) => {
    setEditingId(p.id)
    setEditTitle(p.title)
    setEditContent(p.content)
    setBanner(null)
  }, [])

  function cancelEdit() {
    setEditingId(null)
    setEditTitle("")
    setEditContent("")
  }

  async function handleSaveEdit() {
    if (editingId == null) return
    setBanner(null)
    const res = await fetch(`/api/phrases/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    })
    if (!res.ok) {
      const text = await res.text()
      setBanner(`更新に失敗しました (${res.status}): ${text}`)
      return
    }
    setBanner("更新しました。")
    cancelEdit()
    refreshList()
  }

  async function handleDelete(id: number) {
    if (!window.confirm("このフレーズを削除しますか？")) return
    setBanner(null)
    const res = await fetch(`/api/phrases/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const text = await res.text()
      setBanner(`削除に失敗しました (${res.status}): ${text}`)
      return
    }
    setBanner("削除しました。")
    // id は削除した行、editingId は編集中の行。一致するときだけ編集状態を片付ける。
    // 別行を編集中にほかの行だけ削除した場合は編集を続けたいので cancelEdit しない。
    if (editingId === id) cancelEdit()
    refreshList()
  }

  async function handleCopy(phrase: PhraseRead) {
    try {
      await copyTextToClipboard(getPhraseCopyText(phrase))
      showCopied(phrase.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      window.alert(`コピーに失敗しました: ${message}`)
    }
  }

  async function handleCopyAll() {
    if (phrases.length === 0) {
      window.alert("コピーするフレーズがありません")
      return
    }
    const text = joinPhrasesForCopyAll(phrases)

    try {
      await copyTextToClipboard(text)
      showCopied("all")
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setBanner(`コピーに失敗しました: ${message}`)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", isPending && "opacity-70")}>
      {banner ? (
        <p className="text-sm text-muted-foreground" role="status">
          {banner}
        </p>
      ) : null}

      <Card size="sm">
        <CardHeader>
          <CardTitle>新規作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleCreate}>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">タイトル</span>
              <input
                className={fieldClass}
                name="title"
                required
                minLength={1}
                maxLength={255}
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">内容</span>
              <textarea
                className={cn(fieldClass, "min-h-24 resize-y")}
                name="content"
                required
                minLength={1}
                value={createContent}
                onChange={(e) => setCreateContent(e.target.value)}
              />
            </label>
            <Button type="submit" disabled={isPending}>
              作成（POST）
            </Button>
          </form>
        </CardContent>
      </Card>

      {phrases.length === 0 ? (
        <p className="text-sm text-muted-foreground">フレーズがありません。</p>
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isCopied("all") || phrases.length === 0}
            onClick={() => void handleCopyAll()}
          >
            {isCopied("all") ? "Copied!" : "Copy All"}
          </Button>
          <PhraseTableShell>
            {phrases.map((p) =>
              editingId === p.id ? (
                <TableRow key={p.id}>
                  <TableCell className="align-top">
                    <div className="flex flex-col gap-2">
                      <input
                        className={fieldClass}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        aria-label="編集: 内容"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={isPending}
                        onClick={() => void handleSaveEdit()}
                      >
                        保存（PUT）
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={cancelEdit}
                      >
                        キャンセル
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <PhraseDisplayRow
                  key={p.id}
                  phrase={p}
                  isCopied={isCopied(p.id)}
                  isEditing={false}
                  onStartEdit={startEdit}
                >
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={isCopied(p.id)}
                    onClick={() => void handleCopy(p)}
                  >
                    {isCopied(p.id) ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => void handleDelete(p.id)}
                  >
                    削除
                  </Button>
                </PhraseDisplayRow>
              )
            )}
          </PhraseTableShell>
        </>
      )}
    </div>
  )
}
