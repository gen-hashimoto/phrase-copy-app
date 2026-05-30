export type PhraseRead = {
  id: string
  content: string
  created_at: string
  // Keep the frontend type aligned with the API response.
  updated_at: string
}

export type PhraseCreate = {
  content: string
}

export type PhraseUpdate = {
  content: string
}
