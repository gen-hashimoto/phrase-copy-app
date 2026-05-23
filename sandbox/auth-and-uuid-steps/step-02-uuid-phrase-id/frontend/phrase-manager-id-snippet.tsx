import { useState } from "react"

import type { PhraseRead } from "@/types/phrase"

export const DRAFT_PHRASE_ID = "__draft__"

export function createDraftPhraseRow(): PhraseRead {
  return {
    id: DRAFT_PHRASE_ID,
    content: "",
    created_at: new Date().toISOString(),
  }
}

export function PhraseIdStateExample() {
  const [editingId, setEditingId] = useState<string | null>(null)

  function startEdit(phrase: PhraseRead) {
    setEditingId(phrase.id)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/phrases/${encodeURIComponent(id)}`, { method: "DELETE" })
  }

  // Copy these types and handlers into phrase-manager.tsx, not this component.
  return null
}
