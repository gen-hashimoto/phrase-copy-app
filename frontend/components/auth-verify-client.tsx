"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  token?: string
}

export function AuthVerifyClient({ token }: Props) {
  const router = useRouter()
  const [verifyError, setVerifyError] = useState<string | null>(null)

  useEffect(() => {
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

  if (verifyError) {
    return <p className="text-sm text-muted-foreground">{verifyError}</p>
  }

  return <p className="text-sm text-muted-foreground">ログイン確認中です。</p>
}
