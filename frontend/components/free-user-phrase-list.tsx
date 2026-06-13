import type { PhraseRead } from "@/types/phrase"
import { PhraseManager } from "@/components/phrase-manager"
import { FREE_USER_PHRASE_LIMIT } from "@/lib/phrase-limits"

import { NoticeBanner, type NoticeItem } from "@/components/notice-banner"

function getFreeUserNoticeKinds(phraseCount: number): NoticeItem[] {
  if (phraseCount < FREE_USER_PHRASE_LIMIT) return []

  return [
    {
      id: "free-user-limit-reached",
      message: `上限は${FREE_USER_PHRASE_LIMIT}件です。`,
    },
  ]
}

export function FreeUserPhraseList({ phrases }: { phrases: PhraseRead[] }) {
  const userNotices = getFreeUserNoticeKinds(phrases.length)

  // Loggged-in data comes from the backend and is refreshed after mutations.
  return (
    <div className="flex flex-col gap-6">
      <NoticeBanner notices={userNotices} />
      <PhraseManager
        mode="user"
        phrases={phrases}
        limit={FREE_USER_PHRASE_LIMIT}
      />
    </div>
  )
}
