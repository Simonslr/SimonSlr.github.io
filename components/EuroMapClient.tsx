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
  // Default true (desktop) — useEffect hides on mobile after mount.
  // CSS display:none on .globe-hero-wrapper at ≤860px prevents any flash
  // of the loading placeholder before the effect runs on mobile.
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (window.innerWidth <= 860) setShow(false)
  }, [])

  if (!show) return null
  return <EuroMap />
}
