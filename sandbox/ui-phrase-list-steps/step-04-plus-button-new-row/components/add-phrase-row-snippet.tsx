/**
 * Snippet: "+" below the table starts an inline draft row at the bottom.
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  createDraftPhraseRow,
  DRAFT_PHRASE_ID,
  isDraftPhraseId,
} from "@/lib/draft-phrase"
import type { PhraseRead } from "@/types/phrase"

type Props = {
  phrases: PhraseRead[]
  disabled?: boolean
  onStartDraft: () => void
}

export function AddPhraseControl({ phrases, disabled, onStartDraft }: Props) {
  const hasDraft = phrases.some((p) => isDraftPhraseId(p.id))

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="フレーズを追加"
      disabled={disabled || hasDraft}
      onClick={onStartDraft}
    >
      +
    </Button>
  )
}

// --- merge into phrase-manager.tsx (state sketch) ---

export function useDraftPhraseRow(phrases: PhraseRead[]) {
  const [draftRow, setDraftRow] = useState<PhraseRead | null>(null)

  const displayPhrases =
    draftRow != null ? [...phrases, draftRow] : phrases

  function startDraft() {
    setDraftRow(createDraftPhraseRow())
    // also: setEditingId(DRAFT_PHRASE_ID); setEditContent("");
  }

  function clearDraft() {
    setDraftRow(null)
    // also: if editingId === DRAFT_PHRASE_ID) cancelEdit();
  }

  return { displayPhrases, startDraft, clearDraft, draftRow }
}
