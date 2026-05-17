import type { PhraseRead } from "@/types/phrase"
import { getPhraseCopyText } from "./phrase-copy-text"

/**
 * For Copy All: join each phrase with LF (\n).
 * Design: one phrase per line (no newlines inside content).
 */

export function joinPhrasesForCopyAll(phrases: PhraseRead[]): string {
  return phrases.map(getPhraseCopyText).join("\n")
}
