import { NextResponse } from "next/server"

function apiOrigin(): string | null {
  const base = process.env.API_BASE_URL
  if (!base) return null
  return base.replace(/\/$/, "")
}

export async function GET(request: Request) {
  const origin = apiOrigin()
  if (!origin) {
    return NextResponse.json({ error: "API_BASE_URL missing" }, { status: 500 })
  }

  const res = await fetch(`${origin}/phrases`, {
    cache: "no-store",
    headers: {
      // Forward the browser cookie from Next.js to FastAPI.
      cookie: request.headers.get("cookie") ?? "",
    },
  })
  const data = await res.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: res.status })
}
