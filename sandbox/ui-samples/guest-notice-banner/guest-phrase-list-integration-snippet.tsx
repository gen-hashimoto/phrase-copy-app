"use client"

import { useEffect, useState } from "react"

import { PhraseManager } from "@/components/phrase-manager"
import type { PhraseRead } from "@/types/phrase"

import {
  GuestNoticeBanner,
  type GuestNoticeKind,
} from "./guest-notice-banner-snippet"

const GUEST_LIMIT = 10

function getGuestNoticeKinds(phraseCount: number): GuestNoticeKind[] {
  const notices: GuestNoticeKind[] = []

  if (phraseCount > 0) {
    notices.push("first-guest-phrase")
  }

  if (phraseCount >= GUEST_LIMIT) {
    notices.push("guest-limit-reached")
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
      // Some browsers still require returnValue for compatibility.
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedGuestPhrases])

  return (
    <div className="grid gap-4">
      <GuestNoticeBanner notices={guestNotices} />
      <PhraseManager
        limit={GUEST_LIMIT}
        mode="guest"
        onGuestChange={setPhrases}
        onGuestEditInProgressChange={setHasGuestEditInProgress}
        phrases={phrases}
      />
    </div>
  )
}

