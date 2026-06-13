"use client"

import { useState, useEffect } from "react"

export function useCanHover() {
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")

    function syncCanHover() {
      setCanHover(query.matches)
    }

    syncCanHover()
    query.addEventListener("change", syncCanHover)

    return () => {
      query.removeEventListener("change", syncCanHover)
    }
  }, [])

  return canHover
}
