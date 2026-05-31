import { cookies } from "next/headers"

import { HeaderClientActions } from "./app-header-client-actions-snippet"

type User = {
  email: string
}

async function fetchCurrentUser(): Promise<User | null> {
  const cookie = (await cookies()).toString()
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_ORIGIN}/api/auth/me`, {
    cache: "no-store",
    headers: { cookie },
  })

  if (res.status === 401) return null
  if (!res.ok) throw new Error("Failed to fetch current user")

  const data = await res.json()
  return data.user
}

function AppHeader({ user }: { user: User | null }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div>
          <a className="text-lg font-medium" href="/">
            Phrases
          </a>
          {user ? (
            <p className="text-sm text-muted-foreground">{user.email}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Guest mode</p>
          )}
        </div>
        <HeaderClientActions isLoggedIn={Boolean(user)} />
      </div>
    </header>
  )
}

function AppFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Version 0.0.1</span>
        <span>Copyright © 2026 Phrases</span>
      </div>
    </footer>
  )
}

export async function AppShellServerSample({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await fetchCurrentUser()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
      <AppFooter />
    </div>
  )
}
