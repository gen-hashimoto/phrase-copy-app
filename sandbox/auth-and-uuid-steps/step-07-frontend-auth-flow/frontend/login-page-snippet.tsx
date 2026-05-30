import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col gap-4 p-6">
      <header>
        <h1 className="text-lg font-medium">Login</h1>
        <p className="text-sm text-muted-foreground">
          メールアドレスを入力して Magic Link を発行します。
        </p>
      </header>

      <LoginForm />
    </main>
  )
}
