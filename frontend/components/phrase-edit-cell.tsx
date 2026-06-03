"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

type Props = {
  editingId: string | null
  content: string
  banner: string | null
  setEditContent: (value: string) => void
  setBanner: (value: string | null) => void
  cancelEdit: () => void
  handleSaveEdit: (value: string) => Promise<void> | void
}

const fieldClass =
  "border-input bg-background w-full min-w-0 rounded-md border px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"

export function PhraseEditCell({
  editingId,
  content,
  banner,
  setEditContent,
  setBanner,
  cancelEdit,
  handleSaveEdit,
}: Props) {
  const editInputRef = useRef<HTMLInputElement | null>(null)

  function isImeComposing(e: React.KeyboardEvent<HTMLInputElement>) {
    // Some browser / IME combinations report "Process" during composition.
    return e.nativeEvent.isComposing || e.key === "Process"
  }

  useEffect(() => {
    if (editingId === null) return

    const input = editInputRef.current
    if (input === null) return

    // Focus after React has rendered the edit input.
    input.focus()

    // Put the caret at the end so the user can keep typing immediately.
    const end = input.value.length
    input.setSelectionRange(end, end)
  }, [editingId])
  return (
    <input
      ref={editInputRef}
      className={cn(fieldClass, "h-8", banner != null && "border-destructive")}
      value={content}
      onChange={(e) => {
        setEditContent(e.target.value)
        setBanner(null)
      }}
      aria-label="フレーズを編集"
      aria-invalid={banner != null}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          // Escape is an app shortcut, so prevent the browser default first.
          e.preventDefault()
          cancelEdit()
          return
        }

        // Ignore shortcut handling while the user is confirming IME conversion.
        if (isImeComposing(e)) return

        if (e.key === "Enter" && !e.shiftKey) {
          // Plain Enter saves.
          e.preventDefault()
          handleSaveEdit(content)
        }
      }}
    />
  )
}
