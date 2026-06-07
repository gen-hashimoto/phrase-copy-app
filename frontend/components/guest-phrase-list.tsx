"use client"

import { useState, useEffect } from "react"

import type { PhraseRead } from "@/types/phrase"
import { PhraseManager } from "@/components/phrase-manager"

const GUEST_LIMIT = 10

export function GuestPhraseList() {
  const [phrases, setPhrases] = useState<PhraseRead[]>([])
  const [hasGuestEditInProgress, setHasGuestEditInProgress] = useState(false)

  function canAddGuestPhrase() {
    return phrases.length < GUEST_LIMIT
  }

  const hasUnsavedGuestPhrases = phrases.length > 0 || hasGuestEditInProgress

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
    <>
      {hasUnsavedGuestPhrases ? (
        <p className="text-sm text-muted-foreground">
          未ログイン中はフレーズが保存されません。コピーしてから画面移動してください。
        </p>
      ) : null}
      <PhraseManager
        mode="guest"
        phrases={phrases}
        onGuestChange={setPhrases}
        onGuestEditInProgressChange={setHasGuestEditInProgress}
        limit={GUEST_LIMIT}
      />
      {/* Investigation note: usage display owned by GuestPhraseList. */}
      {/* <p className="text-sm text-muted-foreground"> */}
      {/*   {phrases.length} / {GUEST_LIMIT} used */}
      {/* </p> */}
      {!canAddGuestPhrase() ? (
        <p className="text-sm text-muted-foreground">
          ログインすると {GUEST_LIMIT} 件を超えて保存できます。
        </p>
      ) : null}
    </>
  )
}
