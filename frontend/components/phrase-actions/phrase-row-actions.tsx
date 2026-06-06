"use client"
/** action buttons while a row is in view mode */

import { Copy, Check, Trash2 } from "lucide-react"
import { IconActionButton } from "@/components/phrase-actions/icon-action-button"
import { DeletePhraseAlertDialog } from "@/components/phrase-actions/delete-phrase-alert-dialog"

type Props = {
  onCopy: () => void
  disabledCopy: boolean
  onDelete: () => Promise<void>
  phrasePreview: string
}

export function PhraseRowActions({
  onCopy,
  disabledCopy,
  onDelete,
  phrasePreview,
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
      <DeletePhraseAlertDialog
        phrasePreview={phrasePreview}
        onDelete={onDelete}
      >
        <IconActionButton
          label="Delete phrase"
          icon={Trash2}
          variant="destructive"
        />
      </DeletePhraseAlertDialog>
    </div>
  )
}
