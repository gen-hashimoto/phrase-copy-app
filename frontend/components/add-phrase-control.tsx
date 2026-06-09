"use client"

import { Button } from "./ui/button"
import { Plus } from "lucide-react"

type Props = {
  disabled: boolean
  onAdd: () => void
}
export function AddPhraseControl({ disabled, onAdd }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="フレーズを追加"
      disabled={disabled}
      onClick={onAdd}
    >
      <Plus aria-hidden="true" className="h-4 w-4" />
    </Button>
  )
}
