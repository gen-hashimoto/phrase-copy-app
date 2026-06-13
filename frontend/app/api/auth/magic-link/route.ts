import { NextResponse } from "next/server"
import { apiOrigin } from "@/lib/api-origin"

type BackendErrorDetail =
  | string
  | {
      // FastAPI returns structured errors under `detail`.
      // This route extracts the stable code for the client component.
      code?: string
      message?: string
    }

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
  const detail = data.detail as BackendErrorDetail | undefined

  // Normalize the account-confirmation response for the React form.
  // The component can check `data.code` instead of knowing FastAPI's
  // default `{detail: ...}` error envelope.
  if (backendRes.status === 409 && typeof detail === "object" && detail?.code) {
    return NextResponse.json(
      {
        code: detail.code,
        message: detail.message ?? "Confirmation is required",
      },
      {
        status: backendRes.status,
      }
    )
  }

  // For all other statuses, preserve the backend response as-is.
  return NextResponse.json(data, { status: backendRes.status })
}
