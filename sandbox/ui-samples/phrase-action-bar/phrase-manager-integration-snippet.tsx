"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

import { PhraseEditActions } from "@/components/phrase-actions/phrase-edit-actions"
import { PhraseRowActions } from "@/components/phrase-actions/phrase-row-actions"
import { PhraseContentCell } from "@/components/phrase-content-cell"
import { PhraseEditCell } from "@/components/phrase-edit-cell"
import { PhraseCard } from "@/components/phrase-list/phrase-card"
import { PhraseList } from "@/components/phrase-list/phrase-list"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useCopiedFeedback } from "@/hooks/use-copied-feedback"
import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { cn } from "@/lib/utils"
import { createDraftPhraseRow, DRAFT_PHRASE_ID } from "@/lib/draft-phrase"
import { getPhraseCopyText } from "@/lib/phrase-copy-text"
import { joinPhrasesForCopyAll } from "@/lib/join-phrases-for-copy-all"
import { validatePhraseContent } from "@/lib/validate-phrase-content"
import type { PhraseRead } from "@/types/phrase"

import { PhraseActionBar } from "./phrase-action-bar-snippet"

type PhraseManagerProps = {
  phrases: PhraseRead[]
  mode: "guest" | "user"
  onGuestChange?: (phrases: PhraseRead[]) => void
  onGuestEditInProgressChange?: (value: boolean) => void
  limit?: number
}

export function PhraseManager({
  phrases,
  mode,
  onGuestChange,
  onGuestEditInProgressChange,
  limit,
}: PhraseManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editError, setEditError] = useState<string | null>(null)
  const [draftRow, setDraftRow] = useState<PhraseRead | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [content, setEditContent] = useState("")

  const displayPhrases = draftRow != null ? [...phrases, draftRow] : phrases
  const { showCopied, isCopied } = useCopiedFeedback()

  const isAtLimit = mode === "guest" && limit != null && phrases.length >= limit
  const canAdd = draftRow === null && !isAtLimit
  const canCopyAll = phrases.length > 0

  useEffect(() => {
    if (mode !== "guest") return
    onGuestEditInProgressChange?.(editingId !== null)

    return () => {
      onGuestEditInProgressChange?.(false)
    }
  }, [mode, editingId, onGuestEditInProgressChange])

  function refreshList() {
    startTransition(() => {
      router.refresh()
    })
  }

  async function handleCreate(nextContent: string) {
    if (mode === "guest") {
      if (!onGuestChange) return

      const now = new Date().toISOString()
      const nextPhrase: PhraseRead = {
        id: crypto.randomUUID(),
        content: nextContent,
        created_at: now,
        updated_at: now,
      }

      onGuestChange([...phrases, nextPhrase])
      clearDraft()
      toast.success("作成しました。")
      return
    }

    const res = await fetch("/api/phrases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: nextContent }),
    })

    if (!res.ok) {
      const text = await res.text()
      toast.error(`作成に失敗しました (${res.status}): ${text}`)
      return
    }

    clearDraft()
    toast.success("作成しました。")
    refreshList()
  }

  const startEdit = useCallback((p: PhraseRead) => {
    setEditingId(p.id)
    setEditContent(p.content)
    setEditError(null)
  }, [])

  function startDraft() {
    setDraftRow(createDraftPhraseRow())
    setEditingId(DRAFT_PHRASE_ID)
    setEditContent("")
    setEditError(null)
  }

  function cancelEdit() {
    if (editingId === DRAFT_PHRASE_ID) {
      clearDraft()
      return
    }

    setEditingId(null)
    setEditContent("")
  }

  function clearDraft() {
    setDraftRow(null)
    setEditingId(null)
    setEditContent("")
  }

  async function handleSaveEdit(nextContent: string) {
    const error = validatePhraseContent(nextContent)
    if (error) {
      setEditError(error)
      return
    }
    if (editingId === null) return

    if (editingId === DRAFT_PHRASE_ID) {
      await handleCreate(nextContent)
      return
    }

    if (mode === "guest") {
      if (!onGuestChange) return

      onGuestChange(
        phrases.map((p) =>
          p.id === editingId
            ? {
                ...p,
                content: nextContent,
                updated_at: new Date().toISOString(),
              }
            : p,
        ),
      )
      toast.success("保存しました。")
      cancelEdit()
      return
    }

    const res = await fetch(`/api/phrases/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: nextContent }),
    })

    if (!res.ok) {
      toast.error("保存に失敗しました。")
      return
    }

    cancelEdit()
    toast.success("保存しました。")
    refreshList()
  }

  async function handleDelete(id: string) {
    if (mode === "guest") {
      if (!onGuestChange) return

      onGuestChange(phrases.filter((p) => p.id !== id))
      cancelEdit()
      toast.success("削除しました。")
      return
    }

    try {
      const res = await fetch(`/api/phrases/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      if (editingId === id) cancelEdit()
      toast.success("削除しました。")
      refreshList()
    } catch {
      toast.error("削除に失敗しました。")
    }
  }

  async function handleCopy(phrase: PhraseRead) {
    try {
      await copyTextToClipboard(getPhraseCopyText(phrase))
      showCopied(phrase.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(`コピーに失敗しました: ${message}`)
    }
  }

  async function handleCopyAll() {
    if (phrases.length === 0) {
      toast.error("コピーするフレーズがありません")
      return
    }

    try {
      await copyTextToClipboard(joinPhrasesForCopyAll(phrases))
      showCopied("all")
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(`コピーに失敗しました: ${message}`)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", isPending && "opacity-70")}>
      <PhraseActionBar
        canAdd={canAdd}
        canCopyAll={canCopyAll}
        isCopyAllCopied={isCopied("all")}
        limit={limit}
        mode={mode}
        onAdd={startDraft}
        onCopyAll={() => void handleCopyAll()}
        phraseCount={phrases.length}
      />

      {displayPhrases.length === 0 ? (
        <p className="text-sm text-muted-foreground">フレーズがありません。</p>
      ) : (
        <TooltipProvider>
          <PhraseList>
            {displayPhrases.map((p) =>
              editingId === p.id ? (
                <PhraseCard key={p.id}>
                  <div className="w-full min-w-0 flex-1">
                    <PhraseEditCell
                      cancelEdit={cancelEdit}
                      content={content}
                      editingId={editingId}
                      error={editError}
                      handleSaveEdit={handleSaveEdit}
                      setEditContent={setEditContent}
                      setError={setEditError}
                    />
                  </div>
                  <div className="shrink-0">
                    <PhraseEditActions
                      disabledCancel={false}
                      disabledOk={false}
                      onCancel={cancelEdit}
                      onOk={() => void handleSaveEdit(content)}
                    />
                  </div>
                </PhraseCard>
              ) : (
                <PhraseCard
                  className={cn(
                    (isCopied(p.id) || isCopied("all")) &&
                      "bg-primary/10 transition-colors",
                  )}
                  key={p.id}
                >
                  <div className="w-full min-w-0 flex-1">
                    <PhraseContentCell
                      isCopied={isCopied(p.id) || isCopied("all")}
                      onStartEdit={startEdit}
                      phrase={p}
                    />
                  </div>
                  <div className="shrink-0">
                    <PhraseRowActions
                      disabledCopy={isCopied(p.id)}
                      onCopy={() => void handleCopy(p)}
                      onDelete={() => void handleDelete(p.id)}
                      phrasePreview={p.content}
                    />
                  </div>
                </PhraseCard>
              ),
            )}
          </PhraseList>
        </TooltipProvider>
      )}
    </div>
  )
}

