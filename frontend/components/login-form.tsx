"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { saveMagicLinkSession } from "@/lib/magic-link-session"

type MagicLinkResponse = {
  ok?: boolean
  message?: string
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

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [devLink, setDevLink] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  async function requestMagicLink() {
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
      // The backend remains the source of truth for whether the email exists.
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      })
      const data = (await res.json()) as MagicLinkResponse

      // Any other non-OK response is a real failure for this form.
      if (!res.ok) {
        const errorCode = data.code ?? data.detail?.code
        if (res.status == 429 && errorCode == "RATE_LIMITED") {
          setMessage(
            typeof data.detail === "object" && data.detail?.message
              ? data.detail.message
              : "しばらく待ってから再度お試しください。"
          )
          return
        }
        setMessage(data.error ?? "Magic Link の送信に失敗しました。")
        return
      }

      toast.success(data.message ?? "Magic Link を送信しました。")

      if (typeof data.dev_link === "string") {
        setDevLink(data.dev_link)
      }

      if (!data.dev_link) {
        // Save email and sent-time on success before redirecting
        saveMagicLinkSession(normalizedEmail)
        // Redirect
        router.push("/login/sent")
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
          void requestMagicLink()
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
          未登録のメールアドレスの場合、アカウントが作成されます。
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
    </>
  )
}
