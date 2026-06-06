"use client"

import { type ReactNode } from "react"

export function PhraseList({ children }: { children: ReactNode }) {
  return <div className="grid gap-3">{children}</div>
}
