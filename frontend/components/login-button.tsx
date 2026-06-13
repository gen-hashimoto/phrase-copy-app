import { Button } from "@/components/ui/button"

export function LoginButton() {
  return (
    <Button asChild variant="outline">
      {/* Use a normal anchor so beforeunload can warn about unsaved guest phrases. */}
      {/* next/link uses client-side navigation, which can skip the beforeunload warning. */}
      <a href="/login">Login</a>
    </Button>
  )
}
