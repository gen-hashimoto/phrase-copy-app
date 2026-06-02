"use client"

import { Trash2 } from "lucide-react"
import type { MouseEvent } from "react"
import { useState } from "react"

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
import { Button } from "@/components/ui/button"

type DeletePhraseAlertDialogProps = {
  phrasePreview: string
  onDelete: () => Promise<void>
}

export function DeletePhraseAlertDialog({
  phrasePreview,
  onDelete,
}: DeletePhraseAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    // AlertDialogActionは通常クリック時に閉じるため、削除成功時だけ閉じるように制御する。
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
        <Button
          aria-label="Delete phrase"
          size="icon"
          type="button"
          variant="destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this phrase?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The phrase below will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <blockquote className="overflow-x-auto whitespace-pre rounded-lg border bg-muted p-3 text-sm">
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
