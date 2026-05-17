import { NextResponse } from "next/server"

function apiOrigin(): string | null {
  const base = process.env.API_BASE_URL
  if (!base) return null
  return base.replace(/\/$/, "")
}

export async function GET() {
  const o = apiOrigin()
  if (!o) {
    return NextResponse.json({ error: "API_BASE_URL missing" }, { status: 500 })
  }
  const res = await fetch(`${o}/phrases`, { cache: "no-store" })
  const data = await res.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: Request) {
  const o = apiOrigin()
  if (!o) {
    return NextResponse.json({ error: "API_BASE_URL missing" }, { status: 500 })
  }
  const body = await request.text()
  const res = await fetch(`${o}/phrases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
  const data = await res.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: res.status })
}
