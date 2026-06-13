"use client"
/** action buttons while a row is in edit mode */

import { Save, X } from "lucide-react"
import { IconActionButton } from "@/components/phrase-actions/icon-action-button"

type Props = {
  onOk: () => void
  disabledOk: boolean
  onCancel: () => void
  disabledCancel: boolean
}

export function PhraseEditActions({
  onOk,
  disabledOk,
  onCancel,
  disabledCancel,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-2">
      <IconActionButton
        label="Save changes"
        icon={Save}
        variant="outline"
        onClick={onOk}
        disabled={disabledOk}
      />
      <IconActionButton
        label="Cancel editing"
        icon={X}
        variant="outline"
        onClick={onCancel}
        disabled={disabledCancel}
      />
    </div>
  )
}
