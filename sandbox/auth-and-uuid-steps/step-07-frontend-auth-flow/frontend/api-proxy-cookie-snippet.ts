import { NextResponse } from "next/server"

import { apiOrigin, forwardedCookie } from "@/lib/api-origin"

export async function GET(request: Request) {
  const origin = apiOrigin()

  const res = await fetch(`${origin}/phrases`, {
    cache: "no-store",
    headers: {
      // Forward the browser cookie from Next.js to FastAPI.
      cookie: forwardedCookie(request),
    },
  })
  const data = await res.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: res.status })
}
