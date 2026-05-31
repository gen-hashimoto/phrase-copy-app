import { ClipboardCopy, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Phrase = {
  id: string
  content: string
  updatedAt: string
}

const samplePhrases: Phrase[] = [
  {
    id: "phr_1",
    content: "Thank you for your quick response.",
    updatedAt: "2026-05-31 08:10",
  },
  {
    id: "phr_2",
    content: "I will check and get back to you.",
    updatedAt: "2026-05-30 21:24",
  },
  {
    id: "phr_3",
    content: "Could you share a little more context?",
    updatedAt: "2026-05-29 19:02",
  },
]

function PhraseActions() {
  return (
    <div className="flex justify-end gap-1">
      <Button aria-label="Copy phrase" size="icon" type="button" variant="ghost">
        <ClipboardCopy aria-hidden="true" />
      </Button>
      <Button
        aria-label="Delete phrase"
        size="icon"
        type="button"
        variant="destructive"
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  )
}

function PhraseTable({ compact = false }: { compact?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={compact ? "min-w-72" : ""}>Phrase</TableHead>
          <TableHead className="w-40">Updated</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {samplePhrases.map((phrase) => (
          <TableRow key={phrase.id}>
            <TableCell className={compact ? "min-w-72 whitespace-normal" : "whitespace-normal"}>
              {phrase.content}
            </TableCell>
            <TableCell>{phrase.updatedAt}</TableCell>
            <TableCell>
              <PhraseActions />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function PhraseCardList() {
  return (
    <div className="grid gap-3">
      {samplePhrases.map((phrase) => (
        <Card key={phrase.id} size="sm">
          <CardHeader>
            <CardTitle className="pr-12">{phrase.content}</CardTitle>
            <CardAction>
              <PhraseActions />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Updated: {phrase.updatedAt}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function OptionAResponsiveTableToCards() {
  return (
    <section className="grid gap-3">
      <h2 className="text-base font-medium">案A: Desktop Table / Mobile Card</h2>
      <div className="hidden md:block">
        <PhraseTable />
      </div>
      <div className="md:hidden">
        <PhraseCardList />
      </div>
    </section>
  )
}

export function OptionBScrollableTable() {
  return (
    <section className="grid gap-3">
      <h2 className="text-base font-medium">
        案B: Desktop Table / Mobile 横スクロールTable
      </h2>
      <PhraseTable compact />
    </section>
  )
}

export function OptionCCardOnly() {
  return (
    <section className="grid gap-3">
      <h2 className="text-base font-medium">案C: Desktop / Mobile 共通Card</h2>
      <PhraseCardList />
    </section>
  )
}

export function ResponsiveLayoutSamples() {
  return (
    <main className="mx-auto grid max-w-5xl gap-8 p-4">
      <OptionAResponsiveTableToCards />
      <OptionBScrollableTable />
      <OptionCCardOnly />
    </main>
  )
}
