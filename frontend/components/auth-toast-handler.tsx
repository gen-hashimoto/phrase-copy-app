"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function AuthToastHandler() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const toastType = searchParams.get("toast")
    if (!toastType) return

    if (toastType === "login") {
      toast.success("ログインしました。", { id: "auth-login-toast" })
    }

    if (toastType === "logout") {
      toast.success("ログアウトしました。", { id: "auth-logout-toast" })
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete("toast")

    const nextUrl = nextParams.toString()
      ? `${pathname}?${nextParams.toString()}`
      : pathname

    router.replace(nextUrl, { scroll: false })
  }, [pathname, router, searchParams])

  return null
}
