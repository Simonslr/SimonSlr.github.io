"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const EuroMap = dynamic(() => import("@/components/EuroMap"), {
  ssr: false,
  loading: () => (
    <div
      className="globe-hero-wrapper"
      style={{ background: "var(--bg-dark, #0a0f1e)" }}
    />
  ),
})

export default function EuroMapClient() {
  // Unknown until measured client-side — avoids mounting (and dynamic-
  // importing Three.js/R3F) on mobile just to tear it down a tick later.
  const [show, setShow] = useState<boolean | null>(null)

  useEffect(() => {
    setShow(window.innerWidth > 860)
  }, [])

  if (show === null) {
    return <div className="globe-hero-wrapper" style={{ background: "var(--bg-dark, #0a0f1e)" }} />
  }
  if (!show) return null
  return <EuroMap />
}
