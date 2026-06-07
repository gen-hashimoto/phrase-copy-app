"use client"

import { LogoutButton } from "@/components/logout-button"
import { LoginButton } from "@/components/login-button"
import { ThemeToggle } from "./theme-toggle"

type Props = {
  isLoggedIn: boolean
  showLoginButton: boolean
}

export function AppHeaderClientActions({ isLoggedIn, showLoginButton }: Props) {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      {isLoggedIn ? <LogoutButton /> : showLoginButton ? <LoginButton /> : null}
    </div>
  )
}
