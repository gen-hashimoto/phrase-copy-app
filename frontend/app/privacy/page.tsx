import { Metadata } from "next"
import Link from "next/link"

import { AppShellServer } from "@/components/app-shell-server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchMe } from "@/lib/fetch-me"

export const metadata: Metadata = {
  title: "Privacy Policy",
}

export default async function PrivacyPage() {
  const me = await fetchMe()

  return (
    <AppShellServer user={me} showLoginButton={me === null}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Privacy Policy</CardTitle>
          <CardDescription>Last updated: June 29, 2026</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            Phrases（以下「本サービス」）は、ユーザーの個人情報の取扱いについて、
            以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">1. 収集する情報</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>メールアドレス（ログイン時）</li>
              <li>登録したフレーズの内容（ログイン時）</li>
              <li>アクセスログ（IP アドレス、ブラウザ情報等）</li>
              <li>Cookie（認証セッション、テーマ設定等）</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">2. 利用目的</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>本サービスの提供・認証</li>
              <li>お問い合わせへの対応</li>
              <li>サービス改善・不正利用の防止</li>
              <li>アクセス解析（Google Analytics）</li>
              <li>広告配信（Google AdSense）</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">3. 第三者への提供</h2>
            <p>
              法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。
              ただし、以下の外部サービスを利用する場合、各サービスのポリシーに従い情報が処理されます。
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Google Analytics（アクセス解析）</li>
              <li>Google AdSense（広告）</li>
              <li>AWS（ホスティング・メール送信）</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">4. Cookie</h2>
            <p>
              本サービスは認証のため HttpOnly Cookie を使用します。
              また、解析・広告のため第三者 Cookie が使用される場合があります。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">5. データの保存期間</h2>
            <p>
              アカウントおよびフレーズデータは、ユーザーが削除するか、運営者がサービスを終了するまで保存します。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">6. お問い合わせ</h2>
            <p>
              個人情報の取扱いに関するお問い合わせ:{" "}
              <a
                href="mailto:phrases.chiisaitools@gmail.com"
                className="text-primary underline-offset-4 hover:underline"
              >
                phrases.chiisaitools@gmail.com
              </a>
            </p>
          </section>

          <Button variant="link" asChild className="h-auto p-0">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </AppShellServer>
  )
}
