import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle-snippet"

type HeaderThemeSampleProps = {
  userEmail?: string | null
}

export function HeaderThemeSample({ userEmail }: HeaderThemeSampleProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b bg-background px-4 py-3">
      <div>
        <h1 className="text-lg font-medium">Phrases</h1>
        {userEmail ? (
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {userEmail ? (
          <Button type="button" variant="outline">
            Logout
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
