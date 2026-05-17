/**
 * Reference Copy All button for page or phrase-manager header.
 */
"use client"

import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { joinPhrasesForCopyAll } from "@/lib/join-phrases-for-copy-all"
import type { PhraseRead } from "@/types/phrase"
import { Button } from "@/components/ui/button"

type Props = {
  phrases: PhraseRead[]
  disabled?: boolean
  onSuccess?: () => void
  onError?: (message: string) => void
}

export function CopyAllButton({ phrases, disabled, onSuccess, onError }: Props) {
  async function handleCopyAll() {
    if (phrases.length === 0) {
      onError?.("コピーするフレーズがありません")
      return
    }
    const text = joinPhrasesForCopyAll(phrases)
    try {
      await copyTextToClipboard(text)
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      onError?.(message)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || phrases.length === 0}
      onClick={() => void handleCopyAll()}
    >
      Copy All
    </Button>
  )
}
