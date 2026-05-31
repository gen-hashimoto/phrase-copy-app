"use client"
/** action buttons while a row is in view mode */

import { Copy, Check, Trash2 } from "lucide-react"
import { IconActionButton } from "@/components/icon-action-button"

type Props = {
  onCopy: () => void
  disabledCopy: boolean
  onDelete: () => void
  disabledDelete: boolean
}

export function PhraseRowActions({
  onCopy,
  disabledCopy,
  onDelete,
  disabledDelete,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <IconActionButton
        label={disabledCopy ? "Copied!" : "Copy phrase"}
        icon={disabledCopy ? Check : Copy}
        onClick={onCopy}
        variant="secondary"
        disabled={disabledCopy}
      />
      <IconActionButton
        label="Delete phrase"
        icon={Trash2}
        onClick={onDelete}
        variant="destructive"
        disabled={disabledDelete}
      />
    </div>
  )
}
