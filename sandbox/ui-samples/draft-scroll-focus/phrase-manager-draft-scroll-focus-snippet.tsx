"use client"

import { useEffect, useRef, useState } from "react"

import { PhraseEditActions } from "@/components/phrase-actions/phrase-edit-actions"
import { PhraseContentCell } from "@/components/phrase-content-cell"
import { PhraseCard } from "@/components/phrase-list/phrase-card"
import { PhraseList } from "@/components/phrase-list/phrase-list"
import { createDraftPhraseRow, DRAFT_PHRASE_ID } from "@/lib/draft-phrase"
import type { PhraseRead } from "@/types/phrase"

import { PhraseEditCell } from "./phrase-edit-cell-focus-ref-snippet"
import { PhraseActionBar } from "../phrase-action-bar/phrase-action-bar-snippet"

type PhraseManagerDraftFocusSampleProps = {
  phrases: PhraseRead[]
  limit?: number
}

export function PhraseManagerDraftFocusSample({
  phrases,
  limit,
}: PhraseManagerDraftFocusSampleProps) {
  const [draftRow, setDraftRow] = useState<PhraseRead | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [content, setEditContent] = useState("")
  const [editError, setEditError] = useState<string | null>(null)

  const draftRowRef = useRef<HTMLDivElement | null>(null)
  const draftInputRef = useRef<HTMLInputElement | null>(null)
  const shouldFocusDraftRef = useRef(false)

  const displayPhrases = draftRow != null ? [...phrases, draftRow] : phrases
  const isAtLimit = limit != null && phrases.length >= limit
  const canAdd = draftRow === null && !isAtLimit

  function startDraft() {
    shouldFocusDraftRef.current = true
    setDraftRow(createDraftPhraseRow())
    setEditingId(DRAFT_PHRASE_ID)
    setEditContent("")
    setEditError(null)
  }

  function cancelEdit() {
    if (editingId === DRAFT_PHRASE_ID) {
      setDraftRow(null)
    }

    setEditingId(null)
    setEditContent("")
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

  return (
    <div className="flex flex-col gap-6">
      <PhraseActionBar
        canAdd={canAdd}
        canCopyAll={phrases.length > 0}
        isCopyAllCopied={false}
        limit={limit}
        mode="guest"
        onAdd={startDraft}
        onCopyAll={() => {
          // Phase 2 の handleCopyAll をそのまま渡す。
        }}
        phraseCount={phrases.length}
      />

      <PhraseList>
        {displayPhrases.map((phrase) => {
          const isDraft = phrase.id === DRAFT_PHRASE_ID
          const isEditing = editingId === phrase.id

          return (
            <div key={phrase.id} ref={isDraft ? draftRowRef : undefined}>
              <PhraseCard>
                <div className="w-full min-w-0 flex-1">
                  {isEditing ? (
                    <PhraseEditCell
                      autoFocusOnEdit={!isDraft}
                      cancelEdit={cancelEdit}
                      content={content}
                      editingId={editingId}
                      error={editError}
                      handleSaveEdit={() => {
                        // 既存の handleSaveEdit をそのまま渡す。
                      }}
                      inputRef={isDraft ? draftInputRef : undefined}
                      setEditContent={setEditContent}
                      setError={setEditError}
                    />
                  ) : (
                    <PhraseContentCell
                      isCopied={false}
                      onStartEdit={() => {
                        setEditingId(phrase.id)
                        setEditContent(phrase.content)
                        setEditError(null)
                      }}
                      phrase={phrase}
                    />
                  )}
                </div>

                {isEditing ? (
                  <div className="shrink-0">
                    <PhraseEditActions
                      disabledCancel={false}
                      disabledOk={false}
                      onCancel={cancelEdit}
                      onOk={() => {
                        // 既存の handleSaveEdit(content) をそのまま呼ぶ。
                      }}
                    />
                  </div>
                ) : null}
              </PhraseCard>
            </div>
          )
        })}
      </PhraseList>
    </div>
  )
}

