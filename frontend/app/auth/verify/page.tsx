import { Metadata } from "next"
import { AppShellServer } from "@/components/app-shell-server"
import { AuthVerifyClient } from "@/components/auth-verify-client"
import { fetchMe } from "@/lib/fetch-me"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Verify",
}

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
        <div className="flex flex-col gap-2">
          <h1>無効なリンクです</h1>
          <p className="text-sm text-muted-foreground">
            リンクが正しくないか、期限切れの可能性があります。
          </p>

          <a href="/login" className="text-sm underline">
            ログイン画面に戻る
          </a>
        </div>
      )}
    </AppShellServer>
  )
}
