import { NextResponse } from "next/server"

import { apiOrigin, forwardedCookie } from "@/lib/api-origin"

export async function POST(request: Request) {
  const backendRes = await fetch(`${apiOrigin()}/auth/logout`, {
    method: "POST",
    headers: {
      cookie: forwardedCookie(request),
    },
  })

  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  const res = NextResponse.json(data, { status: backendRes.status })

  // FastAPI が返す expired cookie を browser に転送して session を消す。
  const setCookie = backendRes.headers.get("set-cookie")
  if (setCookie) {
    res.headers.set("set-cookie", setCookie)
  }

  return res
}
