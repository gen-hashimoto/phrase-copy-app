import { Metadata } from "next"
import { AppShellServer } from "@/components/app-shell-server"
import { ResendMagicLinkButton } from "@/components/resend-magic-link-button"
import { fetchMe } from "@/lib/fetch-me"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Sent",
}

export default async function LoginSentPage() {
  const me = await fetchMe()

  if (me) {
    redirect("/")
  }

  return (
    <AppShellServer user={null} showLoginButton={false}>
      <h1>メールを送信しました</h1>
      <p>
        Magic Linkを送信しました。メール内のリンクを開いてログインしてください。
      </p>
      <p className="text-muted-foreground">15 分間有効です。</p>
      <p className="text-sm text-muted-foreground">
        届かない場合は迷惑メールフォルダもご確認ください。
      </p>

      <ResendMagicLinkButton />

      <p>
        <a href="/login" className="text-sm underline">
          ログイン画面に戻る
        </a>
      </p>
    </AppShellServer>
  )
}
