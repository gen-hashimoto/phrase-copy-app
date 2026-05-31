"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function ShadcnToastActionsSample() {
  const { toast } = useToast()

  return (
    <section className="mx-auto grid max-w-md gap-3 rounded-xl border bg-card p-4 text-card-foreground">
      <h2 className="text-base font-medium">shadcn/ui toast examples</h2>
      <Button
        type="button"
        onClick={() =>
          toast({
            title: "Phrase created",
            description: "The new phrase is ready to use.",
          })
        }
      >
        Phrase作成成功
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          toast({
            title: "Login is required",
            description: "Please log in before saving phrases.",
            variant: "destructive",
          })
        }
      >
        未ログイン制限
      </Button>
    </section>
  )
}
