/**
 * Snippet: POST/PUT bodies in phrase-manager.tsx (merge by hand).
 * Remove createTitle, editTitle state and title inputs.
 */

// Draft row (negative id) → create
async function saveDraft(content: string) {
  const res = await fetch("/api/phrases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  })
  return res
}

// Existing row → update
async function saveEdit(id: number, content: string) {
  const res = await fetch(`/api/phrases/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  })
  return res
}
