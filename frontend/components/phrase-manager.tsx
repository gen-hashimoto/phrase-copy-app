"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"

import type { PhraseRead } from "@/types/phrase"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { PhraseTableShell } from "@/components/phrase-table-shell"
import { PhraseDisplayRow } from "@/components/phrase-display-row"
import { AddPhraseControl } from "@/components/add-phrase-control"
import { EditModeActions } from "@/components/edit-mode-actions"
import { cn } from "@/lib/utils"
import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { getPhraseCopyText } from "@/lib/phrase-copy-text"
import { useCopiedFeedback } from "@/hooks/use-copied-feedback"
import { joinPhrasesForCopyAll } from "@/lib/join-phrases-for-copy-all"
import { createDraftPhraseRow, DRAFT_PHRASE_ID } from "@/lib/draft-phrase"
import { validatePhraseContent } from "@/lib/validate-phrase-content"

type PhraseManagerProps = {
  phrases: PhraseRead[]
}

const fieldClass =
  "border-input bg-background w-full min-w-0 rounded-md border px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"

export function PhraseManager({ phrases }: PhraseManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [banner, setBanner] = useState<string | null>(null)
  const [draftRow, setDraftRow] = useState<PhraseRead | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [content, setEditContent] = useState("")

  const displayPhrases = draftRow != null ? [...phrases, draftRow] : phrases

  const { showCopied, isCopied } = useCopiedFeedback()

  function refreshList() {
    startTransition(() => {
      router.refresh()
    })
  }

  async function handleCreate(nextContent: string) {
    setBanner(null)
    const res = await fetch("/api/phrases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: nextContent }),
    })
    if (!res.ok) {
      const text = await res.text()
      setBanner(`作成に失敗しました (${res.status}): ${text}`)
      return
    }
    clearDraft()
    setBanner("作成しました。")
    refreshList()
  }

  const startEdit = useCallback((p: PhraseRead) => {
    setEditingId(p.id)
    setEditContent(p.content)
    setBanner(null)
  }, [])

  function startDraft() {
    setDraftRow(createDraftPhraseRow())
    setEditingId(DRAFT_PHRASE_ID)
    setEditContent("")
  }

  function cancelEdit() {
    if (editingId != null && editingId === DRAFT_PHRASE_ID) {
      clearDraft()
    } else {
      setEditingId(null)
      setEditContent("")
    }
  }

  function clearDraft() {
    setDraftRow(null)
    setEditingId(null)
    setEditContent("")
  }

  async function handleSaveEdit(nextContent: string) {
    const error = validatePhraseContent(nextContent)
    if (error) {
      setBanner(error)
      window.alert(error)
      return
    }
    if (editingId === null) return
    if (editingId === DRAFT_PHRASE_ID) {
      handleCreate(nextContent)
      return
    }
    setBanner(null)
    const res = await fetch(`/api/phrases/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
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

  async function handleDelete(id: string) {
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
            {displayPhrases.map((p) =>
              editingId === p.id ? (
                <TableRow key={p.id}>
                  <TableCell className="align-top">
                    <div className="flex flex-col gap-2">
                      <textarea
                        className={cn(
                          fieldClass,
                          "min-h-20 resize-y",
                          banner != null && "border-destructive"
                        )}
                        value={content}
                        onChange={(e) => {
                          setEditContent(e.target.value)
                          setBanner(null)
                        }}
                        aria-label="フレーズを編集"
                        aria-invalid={banner != null}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            e.preventDefault()
                            cancelEdit()
                            return
                          }
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSaveEdit(content)
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <EditModeActions
                      disabled={false}
                      onOk={() => void handleSaveEdit(content)}
                      onCancel={cancelEdit}
                    />
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
      <div className="flex items-center gap-4">
        <AddPhraseControl
          phrases={phrases}
          disabled={editingId === draftRow?.id}
          onStartDraft={startDraft}
        />
        <p className="text-sm text-muted-foreground">
          {phrases.length} / 10 used
        </p>
      </div>
    </div>
  )
}
