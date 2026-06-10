"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition, useEffect, useRef } from "react"

import type { PhraseRead } from "@/types/phrase"
import { PhraseList } from "@/components/phrase-list/phrase-list"
import { PhraseCard } from "@/components/phrase-list/phrase-card"
import { PhraseContentCell } from "@/components/phrase-content-cell"
import { PhraseEditCell } from "@/components/phrase-edit-cell"
import { PhraseEditActions } from "@/components/phrase-actions/phrase-edit-actions"
import { PhraseRowActions } from "@/components/phrase-actions/phrase-row-actions"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PhraseActionBar } from "@/components/phrase-action-bar"
import { cn } from "@/lib/utils"
import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { getPhraseCopyText } from "@/lib/phrase-copy-text"
import { useCopiedFeedback } from "@/hooks/use-copied-feedback"
import { joinPhrasesForCopyAll } from "@/lib/join-phrases-for-copy-all"
import { createDraftPhraseRow, DRAFT_PHRASE_ID } from "@/lib/draft-phrase"
import { validatePhraseContent } from "@/lib/validate-phrase-content"
import { toast } from "sonner"

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

  const draftRowRef = useRef<HTMLDivElement | null>(null)
  const draftInputRef = useRef<HTMLInputElement | null>(null)
  const shouldFocusDraftRef = useRef(false)

  const displayPhrases = draftRow != null ? [...phrases, draftRow] : phrases

  const { showCopied, isCopied } = useCopiedFeedback()

  const isAtLimit = mode === "guest" && limit != null && phrases.length >= limit
  const canAdd = draftRow === null && !isAtLimit
  const canCopyAll = phrases.length > 0

  useEffect(() => {
    if (mode != "guest") return
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
      toast.success("作成しました。")
      return
    }

    // user
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
    shouldFocusDraftRef.current = true
    setDraftRow(createDraftPhraseRow())
    setEditingId(DRAFT_PHRASE_ID)
    setEditContent("")
    setEditError(null)
  }

  function cancelEdit() {
    if (editingId != null && editingId === DRAFT_PHRASE_ID) {
      clearDraft()
    } else {
      setEditingId(null)
      setEditContent("")
    }
  }

  useEffect(() => {
    if (!shouldFocusDraftRef.current) return
    if (editingId !== DRAFT_PHRASE_ID) return
    if (draftRow === null) return

    shouldFocusDraftRef.current = false

    requestAnimationFrame(() => {
      const input = draftInputRef.current

      if (input !== null) {
        input.focus({ preventScroll: true })
        input.setSelectionRange(input.value.length, input.value.length)
      }

      draftRowRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    })
  }, [draftRow, editingId])

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
      toast.success("保存しました。")
      cancelEdit()
      return
    }

    // user
    const res = await fetch(`/api/phrases/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: nextContent,
      }),
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
    // guest
    if (mode === "guest") {
      if (!onGuestChange) return

      onGuestChange(phrases.filter((p) => p.id !== id))
      cancelEdit()
      toast.success("削除しました。")
      return
    }

    // user
    try {
      const res = await fetch(`/api/phrases/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }
      // id は削除した行、editingId は編集中の行。一致するときだけ編集状態を片付ける。
      // 別行を編集中にほかの行だけ削除した場合は編集を続けたいので cancelEdit しない。
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
    const text = joinPhrasesForCopyAll(phrases)

    try {
      await copyTextToClipboard(text)
      showCopied("all")
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(`コピーに失敗しました: ${message}`)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", isPending && "opacity-70")}>
      <PhraseActionBar
        phraseCount={phrases.length}
        limit={limit}
        mode={mode}
        canCopyAll={canCopyAll}
        isCopyAllCopied={isCopied("all")}
        canAdd={canAdd}
        onCopyAll={() => void handleCopyAll()}
        onAdd={startDraft}
      />
      {displayPhrases.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items</p>
      ) : (
        <>
          <TooltipProvider>
            <PhraseList>
              {displayPhrases.map((p) => {
                const isDraft = p.id === DRAFT_PHRASE_ID
                const isEditing = editingId === p.id

                return (
                  <div key={p.id} ref={isDraft ? draftRowRef : undefined}>
                    {isEditing ? (
                      <PhraseCard key={p.id}>
                        <div className="w-full min-w-0 flex-1">
                          <PhraseEditCell
                            editingId={editingId}
                            content={content}
                            error={editError}
                            autoFocusOnEdit={!isDraft}
                            inputRef={isDraft ? draftInputRef : undefined}
                            setEditContent={setEditContent}
                            setError={setEditError}
                            cancelEdit={cancelEdit}
                            handleSaveEdit={handleSaveEdit}
                          />
                        </div>
                        <div className="shrink-0">
                          <PhraseEditActions
                            onOk={() => void handleSaveEdit(content)}
                            disabledOk={false}
                            onCancel={cancelEdit}
                            disabledCancel={false}
                          />
                        </div>
                      </PhraseCard>
                    ) : (
                      <PhraseCard
                        key={p.id}
                        className={cn(
                          (isCopied(p.id) || isCopied("all")) &&
                            "bg-primary/10 transition-colors"
                        )}
                      >
                        <div className="w-full min-w-0 flex-1">
                          <PhraseContentCell
                            phrase={p}
                            isCopied={isCopied(p.id) || isCopied("all")}
                            onStartEdit={startEdit}
                          />
                        </div>
                        <div className="shrink-0">
                          <PhraseRowActions
                            onCopy={() => void handleCopy(p)}
                            disabledCopy={isCopied(p.id)}
                            onDelete={() => handleDelete(p.id)}
                            phrasePreview={p.content}
                          />
                        </div>
                      </PhraseCard>
                    )}
                  </div>
                )
              })}
            </PhraseList>
          </TooltipProvider>
        </>
      )}
    </div>
  )
}
