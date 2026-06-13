import type { PhraseRead } from "@/types/phrase"
import { PhraseManager } from "@/components/phrase-manager"
import { UserLimitNotice } from "@/components/user-limit-notice"
import { FREE_USER_PHRASE_LIMIT } from "@/lib/phrase-limits"

export function UserPhraseList({ phrases }: { phrases: PhraseRead[] }) {
  // Logged-in data comes from the backend and is refreshed after mutations.
  return (
    <div className="flex flex-col gap-6">
      <UserLimitNotice
        phraseCount={phrases.length}
        limit={FREE_USER_PHRASE_LIMIT}
      />
      <PhraseManager
        mode="user"
        phrases={phrases}
        limit={FREE_USER_PHRASE_LIMIT}
      />
    </div>
  )
}

