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
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(window.innerWidth > 860)
  }, [])

  if (!isDesktop) return null
  return <EuroMap />
}
