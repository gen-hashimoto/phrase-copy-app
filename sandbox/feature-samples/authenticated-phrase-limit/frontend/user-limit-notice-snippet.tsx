"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"

type UserLimitNoticeProps = {
  phraseCount: number
  limit: number
}

export function UserLimitNotice({ phraseCount, limit }: UserLimitNoticeProps) {
  if (phraseCount < limit) {
    return null
  }

  return (
    <Alert>
      <AlertDescription className="text-sm">
        上限は{limit}件です。
      </AlertDescription>
    </Alert>
  )
}

