"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const DEFAULT_MS = 1000

/**
 * Shows brief  "Copied!" feedback after a successful copy.
 * id is a phrase id or "all". Repeated clicks reset the timer.
 */

export function useCopiedFeedback(durationMs = DEFAULT_MS) {
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
    [clearTimer, durationMs]
  )

  useEffect(() => () => clearTimer(), [clearTimer])

  return {
    copiedId,
    showCopied,
    isCopied: (id: string | "all") => copiedId === id,
  }
}
