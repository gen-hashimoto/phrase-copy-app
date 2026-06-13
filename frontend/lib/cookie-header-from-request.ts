import { cookies } from "next/headers"

export async function cookieHeaderFromRequest(): Promise<string> {
  return cookies().then((cookieStore) => cookieStore.toString())
}
