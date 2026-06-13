type ApiErrorBody = {
  detail?: string
  error?: string
}

async function readApiError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => null)) as ApiErrorBody | null

  if (data?.detail) return data.detail
  if (data?.error) return data.error

  return `作成に失敗しました (${res.status})`
}

async function handleCreate(nextContent: string) {
  // ...

  const res = await fetch("/api/phrases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: nextContent }),
  })

  if (!res.ok) {
    toast.error(await readApiError(res))
    return
  }

  clearDraft()
  toast.success("作成しました。")
  refreshList()
}

