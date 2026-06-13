import { AppShellServer } from "@/components/app-shell-server"
import { AuthVerifyClient } from "@/components/auth-verify-client"
import { fetchMe } from "@/lib/fetch-me"
import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{
    token?: string | string[]
  }>
}

export default async function VerifyPage({ searchParams }: Props) {
  const me = await fetchMe()

  if (me) {
    redirect("/")
  }

  const params = await searchParams
  const token = Array.isArray(params.token) ? params.token[0] : params.token

  return (
    <AppShellServer user={null} showLoginButton={false}>
      {token ? (
        <AuthVerifyClient token={token} />
      ) : (
        <p className="text-sm text-muted-foreground">無効なリンクです。</p>
      )}
    </AppShellServer>
  )
}
