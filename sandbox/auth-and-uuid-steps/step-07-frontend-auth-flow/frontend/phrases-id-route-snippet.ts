import { NextResponse } from "next/server"

import { apiOrigin, forwardedCookie } from "@/lib/api-origin"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params
  const body = await request.text()

  const backendRes = await fetch(`${apiOrigin()}/phrases/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie: forwardedCookie(request),
    },
    body,
  })

  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: backendRes.status })
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params

  const backendRes = await fetch(`${apiOrigin()}/phrases/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      cookie: forwardedCookie(request),
    },
  })

  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: backendRes.status })
}
