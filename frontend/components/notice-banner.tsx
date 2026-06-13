"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export type NoticeItem = { id: string; message: string }

type Props = {
  notices: NoticeItem[]
}

export function NoticeBanner({ notices }: Props) {
  const [dismissedNotices, setDismissedNotices] = useState<string[]>([])

  const visibleNotices = notices.filter(
    (notice) => !dismissedNotices.includes(notice.id)
  )

  if (visibleNotices.length === 0) {
    return null
  }

  function handleDismiss(id: string) {
    setDismissedNotices((current) =>
      current.includes(id) ? current : [...current, id]
    )
  }

  return (
    <div className="grid gap-3">
      {visibleNotices.map((notice) => (
        <Alert key={notice.id} className="relative flex items-center pr-12">
          <AlertDescription className="text-sm whitespace-pre-line">
            {notice.message}
          </AlertDescription>
          <Button
            aria-label="通知を閉じる"
            className="absolute right-2 h-7 w-7"
            onClick={() => handleDismiss(notice.id)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  )
}
