"use client"

import type { MouseEvent } from "react"
import React, { useState } from "react"
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
import { cn } from "@/lib/utils"

type Props = {
  phrasePreview: string
  onDelete: () => Promise<void>
  children: React.ReactNode
}

export function DeletePhraseAlertDialog({
  phrasePreview,
  onDelete,
  children,
}: Props) {
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
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>このフレーズを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せません。
            <br />
            下記のフレーズは完全に削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <blockquote
          className={cn(
            "overflow-x-auto rounded-lg border bg-muted p-3 text-sm whitespace-pre",
            "[scrollbar-width:none] hover:[scrollbar-width:thin]",
            "[&::-webkit-scrollbar]:h-0 hover:[&::-webkit-scrollbar]:h-1.5"
          )}
        >
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
