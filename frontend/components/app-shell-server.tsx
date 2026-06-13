import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"

import type { User } from "@/types/user"

type Props = {
  user: User | null
  showLoginButton: boolean
  children: React.ReactNode
}

export function AppShellServer({ user, showLoginButton, children }: Props) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <AppHeader user={user} showLoginButton={showLoginButton} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
      <AppFooter />
    </div>
  )
}
