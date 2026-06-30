import Link from "next/link"
export function AppFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Version 0.0.1</span>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <nav className="flex gap-4">
            <Link
              href="/terms"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              Privacy Policy
            </Link>
          </nav>
          <span>Copyright &copy; 2026 Phrases</span>
        </div>
      </div>
    </footer>
  )
}
