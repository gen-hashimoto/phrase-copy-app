"use client"

import { type ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
