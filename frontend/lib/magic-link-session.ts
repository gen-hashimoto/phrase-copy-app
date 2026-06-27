export const MAGIC_LINK_EMAIL_KEY = "magic_link_email"
export const MAGIC_LINK_LAST_SENT_KEY = "magic_link_last_sent_at"
export const MAGIC_LINK_RESEND_COOLDOWN_SECONDS = 60

export function saveMagicLinkSession(email: string): void {
  sessionStorage.setItem(MAGIC_LINK_EMAIL_KEY, email)
  sessionStorage.setItem(MAGIC_LINK_LAST_SENT_KEY, String(Date.now()))
}
export function readMagicLinkEmail(): string | null {
  return sessionStorage.getItem(MAGIC_LINK_EMAIL_KEY)
}

export function readMagicLinkCooldownEndAt(): number | null {
  const lastSentRaw = sessionStorage.getItem(MAGIC_LINK_LAST_SENT_KEY)
  if (!lastSentRaw) return null

  const lastSent = Number(lastSentRaw)
  if (Number.isNaN(lastSent)) return null

  const endAt = lastSent + MAGIC_LINK_RESEND_COOLDOWN_SECONDS * 1000
  if (Date.now() >= endAt) return null

  return endAt
}

export function markMagicLinkResent(): void {
  sessionStorage.setItem(MAGIC_LINK_LAST_SENT_KEY, String(Date.now()))
}
