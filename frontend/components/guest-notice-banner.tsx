"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export type GuestNoticeKind = "first-guest-phrase" | "guest-limit-reached"

type Props = {
  notices: GuestNoticeKind[]
}

const noticeMessages: Record<GuestNoticeKind, string> = {
  "first-guest-phrase": "未ログイン中はフレーズが保存されません。",
  "guest-limit-reached": "ログインすると10件を超えて保存できます。",
}

export function GuestNoticeBanner({ notices }: Props) {
  const [dismissedNotices, setDismissedNotices] = useState<GuestNoticeKind[]>(
    []
  )
  const visibleNotices = notices.filter(
    (notice) => !dismissedNotices.includes(notice)
  )

  if (visibleNotices.length === 0) {
    return null
  }

  function handleDismiss(notice: GuestNoticeKind) {
    setDismissedNotices((current) =>
      current.includes(notice) ? current : [...current, notice]
    )
  }

  return (
    <div className="grid gap-3">
      {visibleNotices.map((notice) => (
        <Alert key={notice} className="relative flex items-center pr-12">
          <AlertDescription className="text-sm whitespace-pre-line">
            {noticeMessages[notice]}
          </AlertDescription>
          <Button
            aria-label="通知を閉じる"
            className="absolute right-2 h-7 w-7"
            onClick={() => handleDismiss(notice)}
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
