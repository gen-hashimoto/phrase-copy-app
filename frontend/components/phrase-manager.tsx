"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition, type SubmitEvent } from "react"

import type { PhraseRead } from "@/types/phrase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { getPhraseCopyText } from "@/lib/phrase-copy-text"
import { useCopiedFeedback } from "@/hooks/use-copied-feedback"
import { joinPhrasesForCopyAll } from "@/lib/join-phrases-for-copy-all"

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

  function startEdit(p: PhraseRead) {
    setEditingId(p.id)
    setEditTitle(p.title)
    setEditContent(p.content)
    setBanner(null)
  }

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

  // type Props = {
  //   phrases: PhraseRead[]
  //   disabled?: boolean
  //   onSuccess?: () => void
  //   onError?: (message: string) => void
  // }

  async function handleCopyAll() {
    if (phrases.length === 0) {
      window.alert("コピーするフレーズがありません")
      return
    }
    const text = joinPhrasesForCopyAll(phrases)

    try {
      await copyTextToClipboard(text)
      window.alert("コピーに成功しました")
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      window.alert(`コピーに失敗しました: ${message}`)
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
        <Table>
          <TableCaption>一覧（POST / PUT / DELETE は /api 経由）</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">ID</TableHead>
              <TableHead className="min-w-32">タイトル</TableHead>
              <TableHead>内容</TableHead>
              <TableHead className="w-44">作成日時</TableHead>
              <TableHead className="w-52 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phrases.map((p) => (
              <TableRow
                key={p.id}
                className={cn(
                  isCopied(p.id) && "bg-primary/10 transition-colors"
                )}
              >
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                {editingId === p.id ? (
                  <>
                    <TableCell colSpan={2} className="align-top">
                      <div className="flex flex-col gap-2">
                        <input
                          className={fieldClass}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          aria-label="編集: タイトル"
                        />
                        <textarea
                          className={cn(fieldClass, "min-h-20 resize-y")}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          aria-label="編集: 内容"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs whitespace-normal text-muted-foreground">
                      {new Date(p.created_at).toLocaleString("ja-JP")}
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
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell
                      className={cn(
                        "max-w-md text-xs whitespace-normal text-muted-foreground",
                        isCopied(p.id) && "text-foreground"
                      )}
                    >
                      {p.content}
                    </TableCell>
                    <TableCell className="text-xs whitespace-normal text-muted-foreground">
                      {new Date(p.created_at).toLocaleString("ja-JP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={isPending}
                          onClick={() => void handleCopy(p)}
                        >
                          コピー
                        </Button>
                        {isCopied(p.id) ? (
                          <span
                            className="text-xs text-muted-foreground"
                            aria-live="polite"
                          >
                            Copied!
                          </span>
                        ) : null}

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => startEdit(p)}
                        >
                          編集
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
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={isPending || phrases.length === 0}
        onClick={() => void handleCopyAll()}
      >
        Copy All
      </Button>
    </div>
  )
}
