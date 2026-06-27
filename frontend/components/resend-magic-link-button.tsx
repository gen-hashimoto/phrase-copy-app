"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import {
  readMagicLinkEmail,
  readMagicLinkCooldownEndAt,
  markMagicLinkResent,
  MAGIC_LINK_RESEND_COOLDOWN_SECONDS,
} from "@/lib/magic-link-session"

type MagicLinkResponse = {
  ok?: boolean
  message?: string
  error?: string
  code?: string
  detail?: {
    code?: string
    message?: string
  }
}

function remainingSecondsUntil(endAt: number | null, now: number): number {
  if (!endAt) return 0
  return Math.max(0, Math.ceil((endAt - now) / 1000))
}

export function ResendMagicLinkButton() {
  const email = useSyncExternalStore(
    () => () => {},
    readMagicLinkEmail,
    () => null
  )
  const storedCooldownEndAt = useSyncExternalStore(
    () => () => {},
    readMagicLinkCooldownEndAt,
    () => null
  )
  const [cooldownEndAt, setCooldownEndAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const effectiveCooldownEndAt = cooldownEndAt ?? storedCooldownEndAt
  const remainingSeconds = remainingSecondsUntil(effectiveCooldownEndAt, now)

  useEffect(() => {
    if (!effectiveCooldownEndAt || Date.now() >= effectiveCooldownEndAt) return

    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [effectiveCooldownEndAt])

  async function handleResend() {
    if (!email || remainingSeconds > 0 || isSubmitting) return
    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      })
      const data = (await res.json()) as MagicLinkResponse

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

      markMagicLinkResent()
      setCooldownEndAt(Date.now() + MAGIC_LINK_RESEND_COOLDOWN_SECONDS * 1000)
      setNow(Date.now())
      setMessage("Magic Link を再送信しました。")
    } finally {
      setIsSubmitting(false)
    }
  }

  // No email means they opened /login/sent directly -> hide the button.
  if (!email) return null

  const disabled = isSubmitting || remainingSeconds > 0

  return (
    <div className="mt-6 flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => void handleResend()}
      >
        {isSubmitting
          ? "Sending..."
          : remainingSeconds > 0
            ? `Resend in (${remainingSeconds} seconds)`
            : "Resend Magic Link"}
      </Button>

      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  )
}
