"use client"

import { useState } from "react"

import { PhraseEditActions } from "@/components/phrase-edit-actions"
import { PhraseRowActions } from "@/components/phrase-row-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PhraseSample = {
  id: string
  content: string
}

type PhraseRowLayoutAdjustmentExampleProps = {
  phrases: PhraseSample[]
  copiedId: string | null
  onCopy: (phrase: PhraseSample) => void
  onDelete: (phrase: PhraseSample) => Promise<void>
  onSave: (phrase: PhraseSample, nextContent: string) => void
}

const contentCellClass = "min-w-0 max-w-0 align-top"
const actionsCellClass = "w-52 align-top text-right"
const phraseScrollClass =
  "overflow-x-auto whitespace-pre text-sm text-muted-foreground"
const inputClass =
  "h-8 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"

export function PhraseRowLayoutAdjustmentExample({
  phrases,
  copiedId,
  onCopy,
  onDelete,
  onSave,
}: PhraseRowLayoutAdjustmentExampleProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftContent, setDraftContent] = useState("")

  function startEdit(phrase: PhraseSample) {
    setEditingId(phrase.id)
    setDraftContent(phrase.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setDraftContent("")
  }

  function saveEdit(phrase: PhraseSample) {
    onSave(phrase, draftContent)
    cancelEdit()
  }

  return (
    <Table className="w-full table-fixed">
      <colgroup>
        <col style={{ width: "calc(100% - 13rem)" }} />
        <col style={{ width: "13rem" }} />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>内容</TableHead>
          <TableHead className="w-52 text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {phrases.map((phrase) =>
          editingId === phrase.id ? (
            <TableRow key={phrase.id}>
              <TableCell className={contentCellClass}>
                <input
                  aria-label="フレーズを編集"
                  className={inputClass}
                  value={draftContent}
                  onChange={(event) => setDraftContent(event.target.value)}
                />
              </TableCell>
              <TableCell className={actionsCellClass}>
                <div className="flex justify-end gap-2">
                  <PhraseEditActions
                    onOk={() => saveEdit(phrase)}
                    disabledOk={draftContent.trim().length === 0}
                    onCancel={cancelEdit}
                    disabledCancel={false}
                  />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={phrase.id}>
              <TableCell
                className={contentCellClass}
                onDoubleClick={() => startEdit(phrase)}
              >
                <div className={phraseScrollClass}>{phrase.content}</div>
              </TableCell>
              <TableCell className={actionsCellClass}>
                <div className="flex justify-end gap-2">
                  <PhraseRowActions
                    onCopy={() => onCopy(phrase)}
                    disabledCopy={copiedId === phrase.id}
                    onDelete={() => onDelete(phrase)}
                    phrasePreview={phrase.content}
                  />
                </div>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  )
}
