/**
 * Snippet for phrase-manager.tsx "actions" column (merge by hand; do not paste as-is).
 */
"use client"

import { copyTextToClipboard } from "@/lib/copy-to-clipboard"
import { getPhraseCopyText } from "@/lib/phrase-copy-text"
import type { PhraseRead } from "@/types/phrase"
import { Button } from "@/components/ui/button"

type Props = {
  phrase: PhraseRead
  disabled?: boolean
}

export function PhraseCopyButton({ phrase, disabled }: Props) {
  async function handleCopy() {
    try {
      await copyTextToClipboard(getPhraseCopyText(phrase))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      // In production, use existing feedback such as setBanner
      window.alert(`コピーに失敗しました: ${message}`)
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      disabled={disabled}
      onClick={() => void handleCopy()}
    >
      コピー
    </Button>
  )
}
