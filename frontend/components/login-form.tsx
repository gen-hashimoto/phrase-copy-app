"use client"

import { useState } from "react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [devLink, setDevLink] = useState<string | null>(null)

  async function submit() {
    setMessage(null)
    setDevLink(null)
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.error ?? "Magic Link の送信に失敗しました。")
      return
    }
    setMessage("Magic Link を送信しました。")
    if (typeof data.dev_link === "string") {
      setDevLink(data.dev_link)
    }
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          className="rounded-md border px-3 py-2"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <button className="rounded-md border px-3 py-2">Send Magic Link</button>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      {devLink ? <a href={devLink}>Open dev link</a> : null}
    </form>
  )
}
