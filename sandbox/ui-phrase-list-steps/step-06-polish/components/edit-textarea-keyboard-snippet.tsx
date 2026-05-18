/**
 * Snippet: keyboard shortcuts on the edit textarea in phrase-manager.tsx.
 */
"use client"

import { cn } from "@/lib/utils"
import { validatePhraseContent } from "@/lib/validate-phrase-content"

const fieldClass =
  "border-input bg-background w-full min-w-0 rounded-md border px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"

type Props = {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  invalid?: boolean
}

export function EditPhraseTextarea({
  value,
  onChange,
  onSave,
  onCancel,
  invalid,
}: Props) {
  function trySave() {
    const error = validatePhraseContent(value)
    if (error) {
      // In production: setBanner(error) or setFieldError(error)
      window.alert(error)
      return
    }
    onSave()
  }

  return (
    <textarea
      className={cn(fieldClass, "min-h-20 resize-y", invalid && "border-destructive")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="フレーズを編集"
      aria-invalid={invalid}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault()
          onCancel()
        }
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          trySave()
        }
      }}
    />
  )
}
