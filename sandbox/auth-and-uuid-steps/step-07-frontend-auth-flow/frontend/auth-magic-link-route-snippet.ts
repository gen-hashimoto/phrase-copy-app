import { NextResponse } from "next/server"

import { apiOrigin } from "@/lib/api-origin"

export async function POST(request: Request) {
  const body = await request.text()
  const backendRes = await fetch(`${apiOrigin()}/auth/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })

  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: backendRes.status })
}
