"use client"

import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace("/")
    router.refresh()
  }

  return (
    <button className="rounded-md border px-3 py-2" type="button" onClick={logout}>
      Logout
    </button>
  )
}
