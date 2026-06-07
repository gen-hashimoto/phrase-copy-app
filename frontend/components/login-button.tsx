import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LoginButton() {
  return (
    <Button asChild type="button" variant="outline">
      <Link href="/login">Login</Link>
    </Button>
  )
}
