"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const DEFAULT_COPIED_FEEDBACK_MS = 600

/**
 * Shows brief "Copied!" feedback after a successful copy.
 * Keep this short so row highlight does not feel sticky while users copy quickly.
 */
export function useCopiedFeedback(durationMs = DEFAULT_COPIED_FEEDBACK_MS) {
  const [copiedId, setCopiedId] = useState<string | "all" | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const showCopied = useCallback(
    (id: string | "all") => {
      clearTimer()
      setCopiedId(id)
      timerRef.current = setTimeout(() => {
        setCopiedId(null)
        timerRef.current = null
      }, durationMs)
    },
    [clearTimer, durationMs],
  )

  useEffect(() => () => clearTimer(), [clearTimer])

  return {
    copiedId,
    showCopied,
    isCopied: (id: string | "all") => copiedId === id,
  }
}

export function PhraseManagerCopiedFeedbackSample() {
  const { showCopied, isCopied } = useCopiedFeedback(600)

  return {
    showCopied,
    isCopied,
  }
}

