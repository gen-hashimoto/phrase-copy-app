"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("ログイン確認中です...")

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setMessage("無効なリンクです。")
      return
    }

    async function verify() {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) {
        setMessage("リンクが無効、または有効期限切れです。")
        return
      }
      router.replace("/")
      router.refresh()
    }

    void verify()
  }, [router, searchParams])

  return <p className="p-6 text-sm text-muted-foreground">{message}</p>
}
