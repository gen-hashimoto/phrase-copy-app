import { Metadata } from "next"
import { AppShellServer } from "@/components/app-shell-server"
import { LoginForm } from "@/components/login-form"
import { fetchMe } from "@/lib/fetch-me"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login",
}

export default async function LoginPage() {
  const me = await fetchMe()

  if (me) {
    redirect("/")
  }

  return (
    <AppShellServer user={null} showLoginButton={false}>
      <div className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          メールアドレスを入力して Magic Link を発行します。
        </p>
        <LoginForm />
      </div>
    </AppShellServer>
  )
}
