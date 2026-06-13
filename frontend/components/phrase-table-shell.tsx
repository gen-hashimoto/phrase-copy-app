"use client"

import { type ReactNode } from "react"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function PhraseTableShell({ children }: { children: ReactNode }) {
  return (
    <Table className="w-full table-fixed">
      <colgroup>
        <col style={{ width: "auto" }} />
        <col style={{ width: "5rem" }} />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>内容</TableHead>
          <TableHead className="w-20 text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  )
}
