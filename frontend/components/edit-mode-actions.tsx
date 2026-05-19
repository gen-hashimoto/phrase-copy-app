/** action buttons while a row is in edit mode */
"use client"
import { Button } from "@/components/ui/button"

type Props = {
  disabled?: boolean
  onOk: () => void
  onCancel: () => void
}

export function EditModeActions({ disabled, onOk, onCancel }: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button type="button" size="sm" disabled={disabled} onClick={onOk}>
        OK
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  )
}
