// このファイルを `frontend/app/cors-lab/page.tsx` としてコピーするか、
// 中身だけ貼り付けて使う（ステップに応じて import をコメントアウトしてもよい）。

import { BrowserDirectDeleteDemo } from "@/components/browser-direct-delete-demo"
import { BrowserDirectFetchDemo } from "@/components/browser-direct-fetch-demo"
import { BrowserDirectPostDemo } from "@/components/browser-direct-post-demo"
import { BrowserDirectPutDemo } from "@/components/browser-direct-put-demo"
import { ViaNextApiDemo } from "@/components/via-next-api-demo"

export default function CorsLabPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 p-6">
      <header>
        <h1 className="text-xl font-semibold">CORS ラボ</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          sandbox の <code className="rounded bg-muted px-1">cors-mutations-steps</code>{" "}
          を順にトレースする用。
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">1 — ブラウザ直 GET（失敗→成功）</h2>
        <BrowserDirectFetchDemo />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">3 — ブラウザ直 POST</h2>
        <BrowserDirectPostDemo />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">4 — ブラウザ直 PUT</h2>
        <BrowserDirectPutDemo />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">5 — ブラウザ直 DELETE</h2>
        <BrowserDirectDeleteDemo />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">6 — /api 経由（Route Handler）</h2>
        <ViaNextApiDemo />
      </section>
    </main>
  )
}
