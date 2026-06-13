"use client"

import { useState, useEffect } from "react"

import type { PhraseRead } from "@/types/phrase"
import { PhraseManager } from "@/components/phrase-manager"
import { GUEST_PHRASE_LIMIT } from "@/lib/phrase-limits"

import { NoticeBanner, type NoticeItem } from "@/components/notice-banner"

function getGuestNoticeKinds(phraseCount: number): NoticeItem[] {
  const notices: NoticeItem[] = []

  if (phraseCount > 0) {
    notices.push({
      id: "first-guest-phrase",
      message: "未ログイン中はフレーズが保存されません。",
    })
  }

  if (phraseCount >= GUEST_PHRASE_LIMIT) {
    notices.push({
      id: "guest-limit-reached",
      message: `ログインすると${GUEST_PHRASE_LIMIT}件を超えて保存できます。`,
    })
  }
  return notices
}

export function GuestPhraseList() {
  const [phrases, setPhrases] = useState<PhraseRead[]>([])
  const [hasGuestEditInProgress, setHasGuestEditInProgress] = useState(false)

  const hasUnsavedGuestPhrases = phrases.length > 0 || hasGuestEditInProgress
  const guestNotices = getGuestNoticeKinds(phrases.length)

  useEffect(() => {
    // Register the browser warning only when guest data can be lost.
    if (!hasUnsavedGuestPhrases) return

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      // Modern browsers require preventDefault to trigger the confirmation UI.
      event.preventDefault()
      // Some browsers still require returnValue for compatibility
      // Deprecated in the DOM types, but still needed by some browsers for beforeunload.
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      // Always clean up the listener when the warning is no longer needed.
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedGuestPhrases])

  return (
    <div className="flex flex-col gap-6">
      <NoticeBanner notices={guestNotices} />
      <PhraseManager
        mode="guest"
        phrases={phrases}
        onGuestChange={setPhrases}
        onGuestEditInProgressChange={setHasGuestEditInProgress}
        limit={GUEST_PHRASE_LIMIT}
      />
      {/* Investigation note: usage display owned by GuestPhraseList. */}
      {/* <p className="text-sm text-muted-foreground"> */}
      {/*   {phrases.length} / {GUEST_LIMIT} used */}
      {/* </p> */}
    </div>
  )
}
