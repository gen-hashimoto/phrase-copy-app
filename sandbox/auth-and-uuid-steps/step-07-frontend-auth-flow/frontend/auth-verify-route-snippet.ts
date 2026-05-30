import { NextResponse } from "next/server"

import { apiOrigin } from "@/lib/api-origin"

export async function POST(request: Request) {
  const body = await request.text()
  const backendRes = await fetch(`${apiOrigin()}/auth/magic-link/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })

  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  const res = NextResponse.json(data, { status: backendRes.status })

  // FastAPI が発行した HttpOnly cookie を browser 側の cookie として保存する。
  const setCookie = backendRes.headers.get("set-cookie")
  if (setCookie) {
    res.headers.set("set-cookie", setCookie)
  }

  return res
}
