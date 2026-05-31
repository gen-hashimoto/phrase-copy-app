"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition, useRef, useEffect } from "react"

import type { PhraseRead } from "@/types/phrase"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { PhraseTableShell } from "@/components/phrase-table-shell"
import { PhraseDisplayRow } from "@/components/phrase-display-row"
import { AddPhraseControl } from "@/components/add-phrase-control"
import { PhraseEditActions } from "@/components/phrase-edit-actions"
import { PhraseRowActions } from "@/components/phrase-row-actions"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { getPhraseCopyText } from "@/lib/phrase-copy-text"
import { useCopiedFeedback } from "@/hooks/use-copied-feedback"
import { joinPhrasesForCopyAll } from "@/lib/join-phrases-for-copy-all"
import { createDraftPhraseRow, DRAFT_PHRASE_ID } from "@/lib/draft-phrase"
import { validatePhraseContent } from "@/lib/validate-phrase-content"

type PhraseManagerProps = {
  phrases: PhraseRead[]
  mode: "guest" | "user"
  onGuestChange?: (phrases: PhraseRead[]) => void
  limit?: number
}

const fieldClass =
  "border-input bg-background w-full min-w-0 rounded-md border px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"

export function PhraseManager({
  phrases,
  mode,
  onGuestChange,
  limit,
}: PhraseManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [banner, setBanner] = useState<string | null>(null)
  const [draftRow, setDraftRow] = useState<PhraseRead | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [content, setEditContent] = useState("")

  const displayPhrases = draftRow != null ? [...phrases, draftRow] : phrases

  const { showCopied, isCopied } = useCopiedFeedback()

  const isAtLimit = mode === "guest" && limit != null && phrases.length >= limit

  function refreshList() {
    startTransition(() => {
      router.refresh()
    })
  }

  async function handleCreate(nextContent: string) {
    // guest
    if (mode === "guest") {
      if (!onGuestChange) return

      // Use one timestamp so created_at and updated_at match on guest create.
      const now = new Date().toISOString()

      const nextPhrase: PhraseRead = {
        id: crypto.randomUUID(),
        content: nextContent,
        created_at: now,
        updated_at: now,
      }

      onGuestChange([...phrases, nextPhrase])
      clearDraft()
      setBanner("追加しました。")
      return
    }

    // user
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

  function isImeComposing(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Some browser / IME combinations report "Process" during composition.
    return e.nativeEvent.isComposing || e.key === "Process"
  }

  const editTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (editingId === null) return

    const textarea = editTextareaRef.current
    if (textarea === null) return

    // Focus after React has rendered the edit textarea.
    textarea.focus()

    // Put the caret at the end so the user can keep typing immediately.
    const end = textarea.value.length
    textarea.setSelectionRange(end, end)
  }, [editingId])

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

    // guest
    if (mode === "guest") {
      if (!onGuestChange) return

      onGuestChange(
        phrases.map((p) =>
          p.id === editingId
            ? // Guest edits happen in local state, so update the timestamp manually.
              {
                ...p,
                content: nextContent,
                updated_at: new Date().toISOString(),
              }
            : p
        )
      )
      setBanner("更新しました。")
      cancelEdit()
      return
    }

    // user
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
    // guest
    if (mode === "guest") {
      if (!onGuestChange) return

      onGuestChange(phrases.filter((p) => p.id !== id))
      setBanner("削除しました。")
      cancelEdit()
      return
    }

    // user
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

      {displayPhrases.length === 0 ? (
        <p className="text-sm text-muted-foreground">フレーズがありません。</p>
      ) : (
        <>
          {phrases.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              disabled={isCopied("all")}
              onClick={() => void handleCopyAll()}
            >
              {isCopied("all") ? "Copied!" : "Copy All"}
            </Button>
          ) : null}
          <TooltipProvider>
            <PhraseTableShell>
              {displayPhrases.map((p) =>
                editingId === p.id ? (
                  <TableRow key={p.id}>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-2">
                        <textarea
                          ref={editTextareaRef}
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
                              // Escape is an app shortcut, so prevent the browser default first.
                              e.preventDefault()
                              cancelEdit()
                              return
                            }

                            // Ignore shortcut handling while the user is confirming IME conversion.
                            if (isImeComposing(e)) return

                            if (e.key === "Enter" && !e.shiftKey) {
                              // Plain Enter saves; Shift + Enter remains a normal textarea newline.
                              e.preventDefault()
                              handleSaveEdit(content)
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <PhraseEditActions
                        onOk={() => void handleSaveEdit(content)}
                        disabledOk={false}
                        onCancel={cancelEdit}
                        disabledCancel={false}
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
                    <PhraseRowActions
                      onCopy={() => void handleCopy(p)}
                      disabledCopy={isCopied(p.id)}
                      onDelete={() => void handleDelete(p.id)}
                      disabledDelete={isPending}
                    />
                  </PhraseDisplayRow>
                )
              )}
            </PhraseTableShell>
          </TooltipProvider>
        </>
      )}
      <div className="flex items-center gap-4">
        <AddPhraseControl
          phrases={phrases}
          disabled={editingId === draftRow?.id || isAtLimit}
          onStartDraft={startDraft}
        />
        {mode === "guest" ? (
          <p className="text-sm text-muted-foreground">
            {phrases.length} / {limit} used
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{phrases.length} 件</p>
        )}
      </div>
    </div>
  )
}
