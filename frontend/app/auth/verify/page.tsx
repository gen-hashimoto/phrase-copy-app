"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [verifyError, setVerifyError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    async function verify() {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (!res.ok) {
        setVerifyError("リンクが無効、または有効期限切れです。")
        return
      }
      router.replace("/?toast=login")
      router.refresh()
    }

    void verify()
  }, [router, token])

  if (!token) {
    return (
      <p className="p-6 text-sm text-muted-foreground">無効なリンクです。</p>
    )
  }

  if (verifyError) {
    return <p className="p-6 text-sm text-muted-foreground">{verifyError}</p>
  }

  return (
    <p className="p-6 text-sm text-muted-foreground">ログイン確認中です...</p>
  )
}
