"use client"

import { useEffect, useRef, type RefObject } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = {
  editingId: string | null
  content: string
  error: string | null
  autoFocusOnEdit?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  setEditContent: (value: string) => void
  setError: (value: string | null) => void
  cancelEdit: () => void
  handleSaveEdit: (value: string) => Promise<void> | void
}

export function PhraseEditCell({
  editingId,
  content,
  error,
  autoFocusOnEdit = true,
  inputRef,
  setEditContent,
  setError,
  cancelEdit,
  handleSaveEdit,
}: Props) {
  const internalInputRef = useRef<HTMLInputElement | null>(null)
  const editInputRef = inputRef ?? internalInputRef

  function isImeComposing(e: React.KeyboardEvent<HTMLInputElement>) {
    // Some browser / IME combinations report "Process" during composition.
    return e.nativeEvent.isComposing || e.key === "Process"
  }

  useEffect(() => {
    if (!autoFocusOnEdit) return
    if (editingId === null) return

    const input = editInputRef.current
    if (input === null) return

    input.focus({ preventScroll: true })

    const end = input.value.length
    input.setSelectionRange(end, end)
  }, [autoFocusOnEdit, editingId, editInputRef])

  return (
    <div className="grid w-full min-w-0 gap-1">
      <Input
        aria-invalid={error != null}
        aria-label="フレーズを編集"
        className={cn(
          "h-8 rounded-md text-sm",
          error != null && "border-destructive",
        )}
        onChange={(e) => {
          setEditContent(e.target.value)
          setError(null)
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault()
            cancelEdit()
            return
          }

          if (isImeComposing(e)) return

          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSaveEdit(content)
          }
        }}
        ref={editInputRef}
        value={content}
      />

      {error ? (
        <p className="text-sm text-destructive" role="status">
          {error}
        </p>
      ) : null}
    </div>
  )
}

