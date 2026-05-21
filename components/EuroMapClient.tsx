"use client"

import dynamic from "next/dynamic"

// EuroMap doit être dans un Client Component pour utiliser ssr: false.
// D3.js + TopoJSON (~400KB) chargés dans un chunk séparé après le LCP.
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
  return <EuroMap />
}
