function formatPhraseCount({
  phraseCount,
  limit,
}: {
  phraseCount: number
  limit?: number
  mode: "guest" | "user"
}) {
  if (limit != null) {
    return `${phraseCount} / ${limit} used`
  }

  return `${phraseCount} items`
}

