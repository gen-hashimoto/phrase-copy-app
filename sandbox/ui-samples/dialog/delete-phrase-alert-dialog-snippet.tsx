"use client"

import { Trash2 } from "lucide-react"
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
  onDelete: () => Promise<void> | void
}

export function DeletePhraseAlertDialog({
  phrasePreview,
  onDelete,
}: DeletePhraseAlertDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
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

        <blockquote className="rounded-lg border bg-muted p-3 text-sm">
          {phrasePreview}
        </blockquote>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
