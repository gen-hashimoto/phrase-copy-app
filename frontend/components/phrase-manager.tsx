"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"

import type { PhraseRead } from "@/types/phrase"
import { Button } from "@/components/ui/button"
import { PhraseList } from "@/components/phrase-list/phrase-list"
import { PhraseCard } from "@/components/phrase-list/phrase-card"
import { PhraseContentCell } from "@/components/phrase-content-cell"
import { PhraseEditCell } from "@/components/phrase-edit-cell"
import { AddPhraseControl } from "@/components/add-phrase-control"
import { PhraseEditActions } from "@/components/phrase-actions/phrase-edit-actions"
import { PhraseRowActions } from "@/components/phrase-actions/phrase-row-actions"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { getPhraseCopyText } from "@/lib/phrase-copy-text"
import { useCopiedFeedback } from "@/hooks/use-copied-feedback"
import { joinPhrasesForCopyAll } from "@/lib/join-phrases-for-copy-all"
import { createDraftPhraseRow, DRAFT_PHRASE_ID } from "@/lib/draft-phrase"
import { validatePhraseContent } from "@/lib/validate-phrase-content"
import { toast } from "sonner"
import { Copy, Check } from "lucide-react"

type PhraseManagerProps = {
  phrases: PhraseRead[]
  mode: "guest" | "user"
  onGuestChange?: (phrases: PhraseRead[]) => void
  limit?: number
}

export function PhraseManager({
  phrases,
  mode,
  onGuestChange,
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
      {displayPhrases.length === 0 ? (
        <p className="text-sm text-muted-foreground">フレーズがありません。</p>
      ) : (
        <>
          {phrases.length > 0 ? (
            <Button
              type="button"
              variant="secondary"
              disabled={isCopied("all")}
              onClick={() => void handleCopyAll()}
            >
              {isCopied("all") ? (
                <>
                  <Check aria-hidden="true" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" />
                  Copy All
                </>
              )}
            </Button>
          ) : null}
          <TooltipProvider>
            <PhraseList>
              {displayPhrases.map((p) =>
                editingId === p.id ? (
                  <PhraseCard key={p.id}>
                    <div className="w-full min-w-0 flex-1">
                      <PhraseEditCell
                        editingId={editingId}
                        content={content}
                        error={editError}
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
                )
              )}
            </PhraseList>
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
