"use client"

import { useEffect } from "react"

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
// Replace with your ad unit slot ID from AdSense dashboard
const AD_SLOT = "8008139060"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export function AdSenseBanner() {
  useEffect(() => {
    if (!ADSENSE_CLIENT || !AD_SLOT) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // ignore if script not loaded yet
    }
  }, [])

  if (!ADSENSE_CLIENT || !AD_SLOT) return null

  return (
    <div className="my-4 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
