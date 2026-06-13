import { type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PhraseCardProps = {
  children: ReactNode
  className?: string
}

export function PhraseCard({ children, className }: PhraseCardProps) {
  return (
    <Card className={cn("rounded-lg border bg-card py-0", className)}>
      <CardContent className="flex min-w-0 flex-col gap-2 p-2 sm:flex-row sm:items-center">
        {children}
      </CardContent>
    </Card>
  )
}
