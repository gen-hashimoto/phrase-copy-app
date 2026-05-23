"use client"

import { useState } from "react"

import type { PhraseRead } from "@/types/phrase"
import { PhraseManager } from "@/components/phrase-manager"

const GUEST_LIMIT = 10

export function GuestPhraseList() {
  const [phrases, setPhrases] = useState<PhraseRead[]>([])

  function canAddGuestPhrase() {
    return phrases.length < GUEST_LIMIT
  }

  // Guest data stays in browser state. Do not call /api/phrases here.
  return (
    <div>
      <PhraseManager phrases={phrases} />
      <p className="text-sm text-muted-foreground">
        {phrases.length} / {GUEST_LIMIT} used
      </p>
      {!canAddGuestPhrase() ? (
        <p className="text-sm text-muted-foreground">
          ログインすると 10 件を超えて保存できます。
        </p>
      ) : null}
    </div>
  )
}

export function UserPhraseList({ phrases }: { phrases: PhraseRead[] }) {
  // Logged-in data comes from the backend and is refreshed after mutations.
  return <PhraseManager phrases={phrases} />
}
