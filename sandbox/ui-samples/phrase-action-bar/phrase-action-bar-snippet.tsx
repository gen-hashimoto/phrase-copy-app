"use client"

import { Check, Copy, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

type PhraseActionBarProps = {
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
  if (mode === "guest" && limit != null) {
    return `${phraseCount} / ${limit}`
  }

  return `${phraseCount} 件`
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
}: PhraseActionBarProps) {
  return (
    <div className="sticky top-0 z-20 -mx-1 rounded-xl border bg-background/95 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/75 dark:border-border">
      <div className="flex items-center gap-2">
        <Button
          disabled={!canCopyAll || isCopyAllCopied}
          onClick={onCopyAll}
          size="sm"
          type="button"
          variant="secondary"
        >
          {isCopyAllCopied ? (
            <>
              <Check aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">全コピー</span>
            </>
          )}
        </Button>

        <Button
          aria-label="フレーズを追加"
          disabled={!canAdd}
          onClick={onAdd}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">追加</span>
        </Button>

        <p className="ml-auto rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          {formatPhraseCount({ phraseCount, limit, mode })}
        </p>
      </div>
    </div>
  )
}

