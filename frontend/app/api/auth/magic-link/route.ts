import { NextResponse } from "next/server"

function apiOrigin(): string | null {
  const base = process.env.API_BASE_URL
  if (!base) return null
  return base.replace(/\/$/, "")
}

export async function POST(request: Request) {
  const origin = apiOrigin()
  if (!origin) {
    return NextResponse.json({ error: "API_BASE_URL missing" }, { status: 500 })
  }

  const body = await request.text()
  const res = await fetch(`${origin}/auth/magic-link`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body,
  })
  const data = await res.json().catch(() => ({ error: "invalid json" }))

  return NextResponse.json(data, { status: res.status })
}
