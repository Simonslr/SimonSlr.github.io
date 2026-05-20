"use client"

import { useMemo } from "react"

interface PricePoint {
  recorded_at: string
  price:       number
  country:     string
}

interface Props {
  data:    PricePoint[]
  slug:    string
  height?: number
}

const COUNTRY_COLORS: Record<string, string> = {
  FR: "#2563eb",
  DE: "#f59e0b",
  ES: "#dc2626",
}

export default function PriceChart({ data, height = 120 }: Props) {
  const countries = useMemo(() =>
    [...new Set(data.map((d) => d.country))].sort(), [data])

  const byCountry = useMemo(() => {
    const map: Record<string, PricePoint[]> = {}
    for (const c of countries) {
      map[c] = data
        .filter((d) => d.country === c)
        .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    }
    return map
  }, [data, countries])

  if (data.length < 2) return null

  const allPrices = data.map((d) => d.price)
  const minP = Math.min(...allPrices)
  const maxP = Math.max(...allPrices)
  const range = maxP - minP || 1

  const allTimes = data.map((d) => new Date(d.recorded_at).getTime())
  const minT = Math.min(...allTimes)
  const maxT = Math.max(...allTimes)
  const timeRange = maxT - minT || 1

  const W = 600
  const H = height
  const PAD = 8

  const toX = (t: number) => PAD + ((t - minT) / timeRange) * (W - PAD * 2)
  const toY = (p: number) => H - PAD - ((p - minP) / range) * (H - PAD * 2)

  const countryLabels: Record<string, string> = {
    FR: "Amazon.fr", DE: "Amazon.de", ES: "Amazon.es",
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {countries.map((c) => (
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-mute)" }}>
            <span style={{ width: 20, height: 2, background: COUNTRY_COLORS[c] ?? "#999", display: "inline-block", borderRadius: 1 }} />
            {countryLabels[c] ?? c}
          </span>
        ))}
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", display: "block", minWidth: 280 }}
          aria-label="Historique des prix"
        >
          {/* Lignes horizontales */}
          {[0, 0.5, 1].map((frac) => {
            const y = PAD + (1 - frac) * (H - PAD * 2)
            const price = minP + frac * range
            return (
              <g key={frac}>
                <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="var(--border)" strokeWidth="1" />
                <text x={PAD} y={y - 3} fontSize="9" fill="var(--text-mute)" fontFamily="monospace">
                  {price.toFixed(0)} €
                </text>
              </g>
            )
          })}

          {/* Courbes par pays */}
          {countries.map((c) => {
            const pts = byCountry[c]
            if (pts.length < 2) return null
            const color = COUNTRY_COLORS[c] ?? "#999"

            const d = pts.map((pt, i) => {
              const x = toX(new Date(pt.recorded_at).getTime())
              const y = toY(pt.price)
              return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
            }).join(" ")

            return (
              <g key={c}>
                <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((pt, i) => (
                  <circle
                    key={i}
                    cx={toX(new Date(pt.recorded_at).getTime()).toFixed(1)}
                    cy={toY(pt.price).toFixed(1)}
                    r="3"
                    fill={color}
                    opacity="0.8"
                  >
                    <title>{`${countryLabels[c] ?? c} — ${pt.price.toFixed(2)} € — ${new Date(pt.recorded_at).toLocaleDateString("fr-FR")}`}</title>
                  </circle>
                ))}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
