/**
 * Content cell opens edit on double-click / double-tap.a
 */
"use client"

import type { PhraseRead } from "@/types/phrase"
import { cn } from "@/lib/utils"
import { usePhraseDoubleTapEdit } from "@/hooks/use-double-tap-edit"

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
  const handleDoubleTap = usePhraseDoubleTapEdit(onStartEdit, phrase)

  if (isEditing) return null

  return (
    <div
      className={cn(
        "block min-w-0 cursor-text overflow-hidden truncate text-sm",
        isCopied ? "text-foreground" : "text-muted-foreground"
      )}
      style={{ maxWidth: "min(48rem, calc(100vw - 18rem))" }}
      onDoubleClick={() => onStartEdit(phrase)}
      onTouchEnd={handleDoubleTap}
      role="button"
      tabIndex={0}
      aria-label="フレーズを編集(ダブルクリック)"
      onKeyDown={(e) => {
        if (e.key === "Enter") onStartEdit(phrase)
      }}
    >
      {phrase.content}
    </div>
  )
}
