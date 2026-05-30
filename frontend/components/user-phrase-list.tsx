import type { PhraseRead } from "@/types/phrase"
import { PhraseManager } from "@/components/phrase-manager"

export function UserPhraseList({ phrases }: { phrases: PhraseRead[] }) {
  // Loggged-in data comes from the backend and is refreshed after mutations.
  return <PhraseManager mode="user" phrases={phrases} />
}
