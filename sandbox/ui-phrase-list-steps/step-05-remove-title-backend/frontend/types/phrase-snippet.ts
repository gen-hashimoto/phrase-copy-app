/** Snippet: frontend/types/phrase.ts after removing title */

export type PhraseRead = {
  id: number
  content: string
  created_at: string
}

export type PhraseCreate = {
  content: string
}

export type PhraseUpdate = {
  content: string
}
