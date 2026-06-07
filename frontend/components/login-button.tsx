import { Button } from "@/components/ui/button"

export function LoginButton() {
  return (
    <Button asChild type="button" variant="outline">
      {/* Use a normal anchor so beforeurlload can warn about unsaved guest phrases. */}
      {/* next/link uses client-side navigtion, which can skip the beforeurlload warning. */}
      <a href="/login">Login</a>
    </Button>
  )
}
