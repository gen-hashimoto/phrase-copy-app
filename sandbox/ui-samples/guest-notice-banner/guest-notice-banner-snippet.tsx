"use client"

import { X } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export type GuestNoticeKind = "first-guest-phrase" | "guest-limit-reached"

type GuestNoticeBannerProps = {
  notices: GuestNoticeKind[]
}

const noticeMessages: Record<GuestNoticeKind, string> = {
  "first-guest-phrase":
    "未ログイン中はフレーズが保存されません。\nコピーしてから画面移動してください。",
  "guest-limit-reached": "ログインすると10件を超えて保存できます。",
}

export function GuestNoticeBanner({ notices }: GuestNoticeBannerProps) {
  const [dismissedNotices, setDismissedNotices] = useState<GuestNoticeKind[]>([])
  const visibleNotices = notices.filter(
    (notice) => !dismissedNotices.includes(notice),
  )

  if (visibleNotices.length === 0) {
    return null
  }

  function handleDismiss(notice: GuestNoticeKind) {
    setDismissedNotices((current) =>
      current.includes(notice) ? current : [...current, notice],
    )
  }

  return (
    <div className="grid gap-2">
      {visibleNotices.map((notice) => (
        <Alert className="relative pr-12" key={notice}>
          <AlertDescription className="whitespace-pre-line text-sm">
            {noticeMessages[notice]}
          </AlertDescription>
          <Button
            aria-label="通知を閉じる"
            className="absolute right-2 top-2 h-7 w-7"
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

