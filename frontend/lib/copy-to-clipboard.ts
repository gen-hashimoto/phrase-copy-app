/**
 * Write text to the clipboard.
 * Throws on failure (caller shows the error message).
 */

export async function copyTextToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard?.writeText) {
    throw new Error(
      "このブラウザでは clipboard API が使えません(https または localhost が必要な場合があります。)"
    )
  }
  await navigator.clipboard.writeText(text)
}
