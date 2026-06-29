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
  title: "Terms of Service",
}

export default async function TermsPage() {
  const me = await fetchMe()

  return (
    <AppShellServer user={me} showLoginButton={me === null}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">利用規約</CardTitle>
          <CardDescription>最終更新日: 2026年6月29日</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            本利用規約（以下「本規約」）は、Phrases（以下「本サービス」）の利用条件を定めるものです。
            ユーザーは本規約に同意の上、本サービスを利用するものとします。
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">1. サービス内容</h2>
            <p>
              本サービスは、ユーザーがフレーズを登録し、コピーするための Web
              アプリケーションです。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">2. アカウント</h2>
            <p>
              ログイン機能を利用する場合、ユーザーは正確なメールアドレスを登録するものとします。
              Magic Link による認証を用います。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">3. 禁止事項</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>法令または公序良俗に反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>不正アクセス、過度なリクエスト送信</li>
              <li>他人の権利を侵害するコンテンツの登録</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">4. 免責事項</h2>
            <p>
              本サービスは現状有姿で提供されます。運営者は、本サービスの利用により生じた損害について、
              運営者の故意または重過失による場合を除き、責任を負いません。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">5. サービスの変更・終了</h2>
            <p>
              運営者は、事前の通知なく本サービスの内容を変更し、または提供を終了することがあります。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">6. 規約の変更</h2>
            <p>
              運営者は、必要に応じて本規約を変更できます。変更後の規約は本ページに掲載した時点で効力を生じます。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">7. お問い合わせ</h2>
            <p>
              本規約に関するお問い合わせ:{" "}
              <a
                href="mailto:phrases.chiisaitools@gmail.com"
                className="text-primary underline-offset-4 hover:underline"
              >
                phrases.chiisaitools@gmail.com
              </a>
            </p>
          </section>

          <Button variant="link" asChild className="h-auto p-0">
            <Link href="/">トップへ戻る</Link>
          </Button>
        </CardContent>
      </Card>
    </AppShellServer>
  )
}
