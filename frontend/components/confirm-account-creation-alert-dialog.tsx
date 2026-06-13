"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Props = {
  pendingEmail: string | null
  setPendingEmail: (value: string | null) => void
  isSubmitting: boolean
  requestMagicLink: (value: boolean) => Promise<void> | void
}

export function ConfirmAccountCreationAlertDialog({
  pendingEmail,
  setPendingEmail,
  isSubmitting,
  requestMagicLink,
}: Props) {
  return (
    <AlertDialog
      open={pendingEmail != null}
      onOpenChange={(open) => {
        // Closing the dialog means the user backed out
        // Because the backend has not created the account yet, clearing
        // `pendingEmail` is enough to cancel the flow.
        if (!open) setPendingEmail(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>アカウントを作成しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            {pendingEmail}
            はまだ登録されていません。続行すると、このメールでアカウントを作成し、マジックリンクを送信します。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={() => {
              // The second submit explicitly allows account creation.
              // This is the only path that can create a user for a new email.
              void requestMagicLink(true)
            }}
          >
            アカウントを作成してリンクを送信
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
