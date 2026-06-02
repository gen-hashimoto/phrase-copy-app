/**
 * Content cell opens edit on double-click / double-tap.a
 */
"use client"

import type { PhraseRead } from "@/types/phrase"
import { cn } from "@/lib/utils"
import { usePhraseDoubleTapEdit } from "@/hooks/use-double-tap-edit"
import { useEffect, useRef, useState } from "react"

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

  // 内容がはみ出している時の検知
  const ref = useRef<HTMLDivElement | null>(null)
  const [hasHiddenRight, setHasHiddenRight] = useState(false)

  function updateFade() {
    const el = ref.current
    if (!el) return

    const nexttHasHiddenRight =
      el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    // 値が変わった時だけ再レンダリング
    setHasHiddenRight((current) =>
      current === nexttHasHiddenRight ? current : nexttHasHiddenRight
    )
  }

  useEffect(() => {
    updateFade()
  }, [phrase.content])

  // 編集中
  if (isEditing) return null

  return (
    <div className="relative min-w-0">
      <div
        ref={ref}
        className={cn(
          "flex min-h-8 w-full min-w-0 items-center overflow-x-auto text-sm whitespace-pre",
          "[scrollbar-width:none] hover:[scrollbar-width:thin]",
          "[&::-webkit-scrollbar]:h-0 hover:[&::-webkit-scrollbar]:h-1.5",
          isCopied ? "text-foreground" : "text-muted-foreground"
        )}
        onDoubleClick={() => onStartEdit(phrase)}
        onTouchEnd={handleDoubleTap}
        role="button"
        tabIndex={0}
        aria-label="フレーズを編集(ダブルクリック)"
        onKeyDown={(e) => {
          if (e.key === "Enter") onStartEdit(phrase)
        }}
        onScroll={updateFade}
      >
        {phrase.content}
      </div>
      {hasHiddenRight ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
      ) : null}
    </div>
  )
}
