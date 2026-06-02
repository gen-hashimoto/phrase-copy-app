"use client"

import { type ReactNode } from "react"

import type { PhraseRead } from "@/types/phrase"
import { TableCell, TableRow } from "@/components/ui/table"
import { PhraseContentCell } from "@/components/phrase-content-cell"
import { cn } from "@/lib/utils"

type RowProps = {
  phrase: PhraseRead
  isCopied: boolean
  isEditing: boolean
  onStartEdit: (phrase: PhraseRead) => void
  children: ReactNode // Copy / Delete buttons (no Edit after step-02)
}

export function PhraseDisplayRow({
  phrase,
  isCopied,
  isEditing,
  onStartEdit,
  children,
}: RowProps) {
  return (
    <TableRow className={cn(isCopied && "bg-primary/10 transition-colors")}>
      <TableCell
        className={cn(
          "max-w-0 min-w-0 align-middle text-sm",
          isCopied ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <PhraseContentCell
          phrase={phrase}
          isCopied={isCopied}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
        />
      </TableCell>
      <TableCell className="w-20 text-right">
        <div className="flex justify-end gap-2">{children}</div>
      </TableCell>
    </TableRow>
  )
}
