export type PhraseRead = {
  id: number
  title: string
  content: string
  created_at: string
}

export type PhraseCreate = {
  title: string
  content: string
}

export type PhraseUpdate = {
  title?: string
  content?: string
}
