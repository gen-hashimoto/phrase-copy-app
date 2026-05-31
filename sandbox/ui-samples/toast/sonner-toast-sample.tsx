"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

/** layout.tsx に1回だけ配置する想定 */
export function SonnerProviderSample() {
  return <Toaster position="bottom-right" />
}

export function PhraseToastActionsSample() {
  return (
    <section className="mx-auto grid max-w-md gap-3 rounded-xl border bg-card p-4 text-card-foreground">
      <h2 className="text-base font-medium">Toast examples</h2>
      <Button type="button" onClick={() => toast.success("Phrase created")}>
        Phrase作成成功
      </Button>
      <Button type="button" onClick={() => toast.success("Phrase updated")}>
        Phrase更新成功
      </Button>
      <Button type="button" onClick={() => toast.success("Phrase deleted")}>
        Phrase削除成功
      </Button>
      <Button type="button" onClick={() => toast.success("Logged in")}>
        Login成功
      </Button>
      <Button type="button" onClick={() => toast.success("Logged out")}>
        Logout成功
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => toast.warning("Login is required")}
      >
        未ログイン制限
      </Button>
    </section>
  )
}
