"use client"

import { LogOut } from "lucide-react"
// Toaster は @/components/ui/sonner を layout に配置
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "../dark-mode/theme-toggle-snippet"

type HeaderClientActionsProps = {
  isLoggedIn: boolean
}

export function HeaderClientActions({ isLoggedIn }: HeaderClientActionsProps) {
  async function handleLogout() {
    const res = await fetch("/api/auth/logout", { method: "POST" })

    if (!res.ok) {
      toast.error("Logout failed")
      return
    }

    toast.success("Logged out")
    window.location.href = "/"
  }

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      {isLoggedIn ? (
        <Button onClick={handleLogout} type="button" variant="outline">
          <LogOut aria-hidden="true" />
          Logout
        </Button>
      ) : (
        <Button asChild variant="outline">
          <a href="/login">Login</a>
        </Button>
      )}
    </div>
  )
}
