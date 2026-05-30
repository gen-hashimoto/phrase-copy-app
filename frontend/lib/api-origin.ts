export function apiOrigin(): string {
  const base = process.env.API_BASE_URL
  if (!base) {
    throw new Error("API_BASE_URL missing")
  }
  return base.replace(/\/$/, "")
}

export function forwardedCookie(request: Request): string {
  return request.headers.get("cookie") ?? ""
}
