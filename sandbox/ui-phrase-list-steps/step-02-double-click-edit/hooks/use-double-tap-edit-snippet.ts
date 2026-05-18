/**
 * Optional hook: wrap createDoubleTapHandler for phrase-manager.
 */
"use client"

import { useMemo } from "react"
import { createDoubleTapHandler } from "@/lib/double-tap"
import type { PhraseRead } from "@/types/phrase"

export function usePhraseDoubleTapEdit(
  onStartEdit: (phrase: PhraseRead) => void,
  phrase: PhraseRead
) {
  return useMemo(
    () => createDoubleTapHandler(() => onStartEdit(phrase)),
    [onStartEdit, phrase]
  )
}
