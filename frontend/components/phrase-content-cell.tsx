/**
 * Content cell opens edit on double-click / double-tap
 */
"use client"

import type { PhraseRead } from "@/types/phrase"
import { cn } from "@/lib/utils"
import { usePhraseDoubleTapEdit } from "@/hooks/use-double-tap-edit"
import { useEffect, useRef, useState } from "react"

type Props = {
  phrase: PhraseRead
  isCopied: boolean
  onStartEdit: (phrase: PhraseRead) => void
}

export function PhraseContentCell({ phrase, isCopied, onStartEdit }: Props) {
  const handleDoubleTap = usePhraseDoubleTapEdit(onStartEdit, phrase)

  // 右側にまだ隠れている内容があるか
  const ref = useRef<HTMLDivElement | null>(null)
  const [hasHiddenRight, setHasHiddenRight] = useState(false)

  function updateFade() {
    const el = ref.current
    if (!el) return

    const nextHasHiddenRight =
      el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    // 値が変わった時だけ再レンダリング
    setHasHiddenRight((current) =>
      current === nextHasHiddenRight ? current : nextHasHiddenRight
    )
  }

  useEffect(() => {
    updateFade()
  }, [phrase.content])

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
