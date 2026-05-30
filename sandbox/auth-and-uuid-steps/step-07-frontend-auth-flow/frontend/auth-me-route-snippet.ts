import { NextResponse } from "next/server"

import { apiOrigin, forwardedCookie } from "@/lib/api-origin"

export async function GET(request: Request) {
  const backendRes = await fetch(`${apiOrigin()}/auth/me`, {
    cache: "no-store",
    headers: {
      cookie: forwardedCookie(request),
    },
  })

  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: backendRes.status })
}
