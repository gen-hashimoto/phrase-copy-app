"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const res = await fetch("/api/auth/logout", { method: "POST" })

    if (!res.ok) {
      toast.error("ログアウトに失敗しました。")
      return
    }

    router.replace("/?toast=logout")
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut aria-hidden="true" />
      Logout
    </Button>
  )
}
