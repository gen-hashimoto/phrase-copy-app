import { NextResponse } from "next/server"
import { apiOrigin } from "@/lib/api-origin"

export async function POST(request: Request) {
  // Forward the raw request body so the backend remains the validation source.
  // This also lets the backend own the confirmation contract.
  const body = await request.text()
  const backendRes = await fetch(`${apiOrigin()}/auth/magic-link`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body,
  })

  // Keep proxy behavior tolerant of unexpected backend responses.
  // The UI can show a generic message if JSON parsing fails.
  const data = await backendRes.json().catch(() => ({ error: "invalid json" }))

  // For all other statuses, preserve the backend response as-is.
  return NextResponse.json(data, { status: backendRes.status })
}
