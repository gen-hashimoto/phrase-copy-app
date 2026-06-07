import { LogoutButton } from "@/components/logout-button"
import { LoginButton } from "@/components/login-button"

import { ThemeToggle } from "./theme-toggle"
type Props = {
  userEmail?: string | null
}

export function HeaderTheme({ userEmail }: Props) {
  return (
    <header className="flex items-center justify-between gap-4 bg-background py-3">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-medium">Phrases</h1>
        {userEmail ? (
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {userEmail ? <LogoutButton /> : <LoginButton />}
      </div>
    </header>
  )
}
