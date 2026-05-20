/**
 * Phrase body must be a single line (no CR/LF) for Copy all / Easy Import.
 */
export function validatePhraseContent(content: string): string | null {
  const trimmed = content.trim()
  if (trimmed.length === 0) {
    return "内容を入力してください"
  }
  if (/[\r\n]/.test(content)) {
    return "フレーズに改行は含められません"
  }
  return null
}
