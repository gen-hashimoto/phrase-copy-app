"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmAccountCreationAlertDialog } from "@/components/confirm-account-creation-alert-dialog"
import { toast } from "sonner"

type MagicLinkResponse = {
  ok?: boolean
  dev_link?: string | null
  error?: string
  code?: string
  // FastAPI returns structured errors under `detail` by default.
  // The Next.js route may flatten this shape, so the UI accepts both forms.
  detail?: {
    code?: string
    message?: string
  }
}

// Keep this value shared conceptually with the backend.
// In production code, consider exporting it from a small shared constants module
// if the frontend and backend live in the TypeScript package.
const ACCOUNT_CREATION_CONFIRMATION_REQUIRED =
  "ACCOUNT_CREATION_CONFIRMATION_REQUIRED"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [devLink, setDevLink] = useState<string | null>(null)
  // `pendingEmail` controls the AlertDialog.
  // A non-null value means the backend refused to create a new account
  // until the user explicitly confirms the side effect.
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function requestMagicLink(confirmAccountCreation: boolean) {
    // Normalize before sending so the same address does not create duplicates
    // because of casing or accidental whitespace.
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return

    // Clear previous UI state before each attempt.
    // This keeps an old success message or dev link from staying visible
    // while a new request is in progress.
    setIsSubmitting(true)
    setMessage(null)
    setDevLink(null)

    try {
      // First submit: confirm_account_creation is false.
      // Confirm submit: confirm_account_creation is true.
      // The backend remains the source of truth for whether the email exists.
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          confirm_account_creation: confirmAccountCreation,
        }),
      })
      const data = (await res.json()) as MagicLinkResponse

      // The error code may come from the backend directly (`detail.code`)
      // or from the Next.js proxy route after normalization (`code`)
      const errorCode = data.code ?? data.detail?.code

      // 409 means "the request is valid, but needs user confirmation first".
      // Do not show this as a failure message; open the confirmation dialog.
      if (
        res.status === 409 &&
        errorCode === ACCOUNT_CREATION_CONFIRMATION_REQUIRED
      ) {
        setPendingEmail(normalizedEmail)
        return
      }

      // Any other non-OK response is a real failure for this form.
      if (!res.ok) {
        setMessage(data.error ?? "Magic Link の送信に失敗しました。")
        return
      }

      // Success covers both existing users and confirmed new account creation.
      setPendingEmail(null)
      toast.success("Magic Link を送信しました。")
      if (typeof data.dev_link === "string") {
        setDevLink(data.dev_link)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          // The normal submit path never creates an account immediately.
          // If the email is new, the backend returns 409 and the dialog opens.
          void requestMagicLink(false)
        }}
      >
        <label className="flex flex-col gap-1 text-sm">
          Email
          <Input
            autoComplete="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        {/* Keep a short inline explanation visible before the user submits. */}
        <p className="text-sm text-muted-foreground">
          初めて利用するメールアドレスの場合、確認後にアカウントが作成されます。
        </p>

        <div className="flex sm:justify-end">
          <Button
            className="w-full sm:w-auto"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Magic Link"}
          </Button>
        </div>

        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
        {devLink ? <a href={devLink}>Open dev link</a> : null}
      </form>
      <ConfirmAccountCreationAlertDialog
        pendingEmail={pendingEmail}
        setPendingEmail={setPendingEmail}
        isSubmitting={isSubmitting}
        requestMagicLink={requestMagicLink}
      />
    </>
  )
}
