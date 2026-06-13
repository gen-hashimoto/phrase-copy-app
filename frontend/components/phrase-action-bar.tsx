"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { AddPhraseControl } from "@/components/add-phrase-control"

type Props = {
  phraseCount: number
  limit?: number
  mode: "guest" | "user"
  canCopyAll: boolean
  isCopyAllCopied: boolean
  canAdd: boolean
  onCopyAll: () => void
  onAdd: () => void
}

function formatPhraseCount({
  phraseCount,
  limit,
  mode,
}: {
  phraseCount: number
  limit?: number
  mode: "guest" | "user"
}) {
  if (limit != null) {
    return `${phraseCount} / ${limit} used`
  }

  return `${phraseCount} items`
}

export function PhraseActionBar({
  phraseCount,
  limit,
  mode,
  canCopyAll,
  isCopyAllCopied,
  canAdd,
  onCopyAll,
  onAdd,
}: Props) {
  return (
    <div className="sticky top-3 z-20 -mx-1 rounded-xl border bg-background/95 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/75 dark:border-border">
      <div className="flex items-center gap-2">
        <AddPhraseControl disabled={!canAdd} onAdd={onAdd} />

        <p className="mr-auto text-sm text-muted-foreground">
          {formatPhraseCount({ phraseCount, limit, mode })}
        </p>

        <Button
          type="button"
          variant="secondary"
          disabled={!canCopyAll || isCopyAllCopied}
          onClick={onCopyAll}
        >
          {isCopyAllCopied ? (
            <>
              <Check aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <Copy aria-hidden="true" />
              Copy All
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
