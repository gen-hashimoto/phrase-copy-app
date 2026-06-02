"use client"

import { Trash2 } from "lucide-react"
import type { MouseEvent } from "react"
import { useState } from "react"
import { IconActionButton } from "@/components/icon-action-button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Props = {
  phrasePreview: string
  onDelete: () => Promise<void>
}

export function DeletePhraseAlertDialog({ phrasePreview, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    // AlertDialogAction は通常クリック時に閉じるため、削除成功時だけ閉じるように制御する。
    event.preventDefault()
    setIsDeleting(true)
    try {
      await onDelete()
      setIsOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          setIsOpen(nextOpen)
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <IconActionButton
          label="Delete phrase"
          icon={Trash2}
          variant="destructive"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this phrase?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The phrase below will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <blockquote className="overflow-x-auto rounded-lg border bg-muted p-3 text-sm whitespace-pre">
          {phrasePreview}
        </blockquote>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
