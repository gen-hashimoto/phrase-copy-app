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

  // Forward the raw request body so backend validation stays the source of truth.
  const body = await request.text()
  const backendRes = await fetch(`${origin}/auth/magic-link/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  const res = NextResponse.json(data, { status: backendRes.status })

  // Forward Set-Cookie from backend to the browser.
  const setCookie = backendRes.headers.get("set-cookie")
  if (setCookie) {
    res.headers.set("set-cookie", setCookie)
  }

  return res
}
