import { NextResponse } from "next/server"

import { apiOrigin, forwardedCookie } from "@/lib/api-origin"

export async function GET(request: Request) {
  const backendRes = await fetch(`${apiOrigin()}/phrases`, {
    cache: "no-store",
    headers: {
      cookie: forwardedCookie(request),
    },
  })

  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: backendRes.status })
}

export async function POST(request: Request) {
  const body = await request.text()
  const backendRes = await fetch(`${apiOrigin()}/phrases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: forwardedCookie(request),
    },
    body,
  })

  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: backendRes.status })
}
