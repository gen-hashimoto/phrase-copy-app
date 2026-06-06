"use client"

import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = {
  editingId: string | null
  content: string
  error: string | null
  setEditContent: (value: string) => void
  setError: (value: string | null) => void
  cancelEdit: () => void
  handleSaveEdit: (value: string) => Promise<void> | void
}

export function PhraseEditCell({
  editingId,
  content,
  error,
  setEditContent,
  setError,
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
    <div className="grid w-full min-w-0 gap-1">
      <Input
        ref={editInputRef}
        className={cn(
          "h-8 rounded-md text-sm",
          error != null && "border-destructive"
        )}
        value={content}
        onChange={(e) => {
          setEditContent(e.target.value)
          setError(null)
        }}
        aria-label="フレーズを編集"
        aria-invalid={error != null}
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

      {error ? (
        <p className="text-sm text-destructive" role="status">
          {error}
        </p>
      ) : null}
    </div>
  )
}
