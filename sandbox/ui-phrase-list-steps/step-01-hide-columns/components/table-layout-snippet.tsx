/**
 * Snippet: simplified table header + display row (merge into phrase-manager.tsx).
 * API may still return id, title, created_at — only hide them in the UI.
 */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ReactNode } from "react"
import type { PhraseRead } from "@/types/phrase"
import { cn } from "@/lib/utils"

type RowProps = {
  phrase: PhraseRead
  isCopied: boolean
  children: ReactNode // Copy / Delete buttons (no Edit after step-02)
}

export function PhraseTableShell({ children }: { children: ReactNode }) {
  return (
    <Table>
      <TableCaption>フレーズ一覧</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>内容</TableHead>
          <TableHead className="w-52 text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  )
}

export function PhraseDisplayRow({ phrase, isCopied, children }: RowProps) {
  return (
    <TableRow className={cn(isCopied && "bg-primary/10 transition-colors")}>
      <TableCell
        className={cn(
          "max-w-md text-sm whitespace-normal",
          isCopied ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {phrase.content}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-wrap justify-end gap-2">{children}</div>
      </TableCell>
    </TableRow>
  )
}
