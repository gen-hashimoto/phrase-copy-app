"use client"

import { Button } from "./ui/button"
import { isDraftPhraseId } from "@/lib/draft-phrase"
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
