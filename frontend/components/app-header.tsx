import Link from "next/link"
import type { User } from "@/types/user"
import { AppHeaderClientActions } from "@/components/app-header-client-actions"

type Props = {
  user: User | null
  showLoginButton: boolean
}

export function AppHeader({ user, showLoginButton }: Props) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div>
          <Link href="/" className="text-lg font-medium">
            Phrases-from-ECR-makefile
          </Link>
          {user ? (
            <p className="text-sm text-muted-foreground">{user.email}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Guest mode</p>
          )}
        </div>
        <AppHeaderClientActions
          isLoggedIn={Boolean(user)}
          showLoginButton={showLoginButton}
        />
      </div>
    </header>
  )
}
