import type { PhraseRead } from "@/types/phrase"

/** Client-only id for a row that is not saved to the API yet. */
export const DRAFT_PHRASE_ID = -1

export function isDraftPhraseId(id: number): boolean {
  return id < 0
}

/** Build a placeholder row appended at the bottom of the table. */
/** After step-05, omit `title` from PhraseRead and this object. */
export function createDraftPhraseRow(): PhraseRead {
  return {
    id: DRAFT_PHRASE_ID,
    title: "", // remove field after step-05-remove-title-backend
    content: "",
    created_at: new Date().toISOString(),
  }
}
