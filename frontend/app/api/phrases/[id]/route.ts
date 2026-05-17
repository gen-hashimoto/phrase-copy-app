import { NextResponse } from "next/server"

function apiOrigin(): string | null {
  const base = process.env.API_BASE_URL
  if (!base) return null
  return base.replace(/\/$/, "")
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const o = apiOrigin()
  if (!o) {
    return NextResponse.json({ error: "API_BASE_URL missing" }, { status: 500 })
  }
  const body = await request.text()
  const res = await fetch(`${o}/phrases/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  })
  const data = await res.json().catch(() => ({ error: "invalid json" }))
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const o = apiOrigin()
  if (!o) {
    return NextResponse.json({ error: "API_BASE_URL missing" }, { status: 500 })
  }
  const res = await fetch(`${o}/phrases/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
  const text = await res.text()
  if (!res.ok) {
    let data: unknown = { error: text || res.statusText }
    try {
      data = JSON.parse(text)
    } catch {
      /* plain text */
    }
    return NextResponse.json(data, { status: res.status })
  }
  if (!text) {
    return NextResponse.json({ deleted: true }, { status: res.status })
  }
  try {
    return NextResponse.json(JSON.parse(text), { status: res.status })
  } catch {
    return NextResponse.json(
      { deleted: true, body: text },
      { status: res.status }
    )
  }
}
