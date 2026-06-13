type PhraseManagerProps = {
  phrases: PhraseRead[]
  mode: "guest" | "user"
  onGuestChange?: (phrases: PhraseRead[]) => void
  onGuestEditInProgressChange?: (value: boolean) => void
  limit?: number
}

export function PhraseManager({
  phrases,
  mode,
  onGuestChange,
  onGuestEditInProgressChange,
  limit,
}: PhraseManagerProps) {
  // ...

  const isAtLimit = limit != null && phrases.length >= limit
  const canAdd = draftRow === null && !isAtLimit

  // ...
}

