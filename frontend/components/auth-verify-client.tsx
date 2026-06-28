"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

type Props = {
  token?: string
}

type VerifyStatus = "loading" | "success" | "error"

export function AuthVerifyClient({ token }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<VerifyStatus>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (!res.ok) {
          setErrorMessage("リンクが無効、または有効期限切れです。")
          setStatus("error")
          return
        }

        setStatus("success")
        await new Promise((resolve) => setTimeout(resolve, 600))
        router.replace("/?toast=login")
        router.refresh()
      } catch {
        setErrorMessage("通信に失敗しました。再度お試しください。")
        setStatus("error")
      }
    }

    void verify()
  }, [router, token])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">ログイン確認中です。</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <p className="text-sm text-muted-foreground">
        ログインしました。移動しています...。
      </p>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <a href="/login" className="text-sm underline">
          ログイン画面に戻る
        </a>
      </div>
    )
  }

  return null
}
