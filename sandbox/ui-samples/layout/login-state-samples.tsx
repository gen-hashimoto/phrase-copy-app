import { HeaderClientActions } from "./app-header-client-actions-snippet"

function HeaderPreview({ userEmail }: { userEmail?: string }) {
  return (
    <header className="rounded-xl border bg-background">
      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-lg font-medium">Phrases</p>
          {userEmail ? (
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Guest mode</p>
          )}
        </div>
        <HeaderClientActions isLoggedIn={Boolean(userEmail)} />
      </div>
    </header>
  )
}

export function LoginStateSamples() {
  return (
    <section className="mx-auto grid max-w-3xl gap-4 p-4">
      <div className="grid gap-2">
        <h2 className="text-base font-medium">ログイン前</h2>
        <HeaderPreview />
      </div>
      <div className="grid gap-2">
        <h2 className="text-base font-medium">ログイン後</h2>
        <HeaderPreview userEmail="user@example.com" />
      </div>
    </section>
  )
}
