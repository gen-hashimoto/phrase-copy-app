/**
 * Snippet: content cell opens edit on double-click / double-tap.
 */
"use client"

import type { PhraseRead } from "@/types/phrase"
import { cn } from "@/lib/utils"
import { createDoubleTapHandler } from "@/lib/double-tap"

type Props = {
  phrase: PhraseRead
  isEditing: boolean
  isCopied: boolean
  onStartEdit: (phrase: PhraseRead) => void
}

export function PhraseContentCell({
  phrase,
  isEditing,
  isCopied,
  onStartEdit,
}: Props) {
  if (isEditing) return null

  const handleDoubleTap = createDoubleTapHandler(() => onStartEdit(phrase))

  return (
    <td
      className={cn(
        "max-w-md cursor-text text-sm whitespace-normal",
        isCopied ? "text-foreground" : "text-muted-foreground"
      )}
      onDoubleClick={() => onStartEdit(phrase)}
      onTouchEnd={handleDoubleTap}
      role="button"
      tabIndex={0}
      aria-label="フレーズを編集（ダブルクリック）"
      onKeyDown={(e) => {
        if (e.key === "Enter") onStartEdit(phrase)
      }}
    >
      {phrase.content}
    </td>
  )
}
