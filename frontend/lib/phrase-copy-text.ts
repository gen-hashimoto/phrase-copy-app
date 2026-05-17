import type { PhraseRead } from "@/types/phrase"

/** Text for a single pharase to to put on the clipboard */
export function getPhraseCopyText(phrase: PhraseRead): string {
  return phrase.content
}
