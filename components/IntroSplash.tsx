"use client"

import { useState, useEffect } from "react"
import { ARROWS, STARS, StarShape, STAR_SIZE } from "./EuroPrixLogo"

// Animated logo: arrows draw in (0→0.55), stars fade in (0.55→1), text (0.9→1)
function AnimatedLogo({ progress }: { progress: number }) {
  const arrowProg = Math.min(1, progress / 0.55)
  const starsProg = Math.max(0, (progress - 0.55) / 0.45)
  const textOpacity = progress > 0.9 ? (progress - 0.9) / 0.1 : 0
  const headOpacity = arrowProg > 0.85 ? (arrowProg - 0.85) / 0.15 : 0
  const DASH = 100

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <svg width={240} height={240} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
        {ARROWS.map((a, i) => (
          <g key={i}>
            <path
              d={a.d}
              stroke="#0F172A"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={DASH * (1 - arrowProg)}
            />
            <g
              transform={`translate(${a.hx} ${a.hy}) rotate(${a.hang})`}
              style={{ opacity: headOpacity }}
            >
              <polygon points="0,0 10,4 10,-4" fill="#0F172A" />
            </g>
          </g>
        ))}
        {STARS.map((s, i) => {
          const localProg = Math.max(0, Math.min(1, (starsProg - (i / 12) * 0.5) * 2.5))
          return (
            <g
              key={i}
              style={{
                opacity: localProg,
                transform: `scale(${0.6 + 0.4 * localProg})`,
                transformOrigin: `${s.x}px ${s.y}px`,
              }}
            >
              <StarShape cx={s.x} cy={s.y} r={STAR_SIZE} fill="#0F172A" />
            </g>
          )
        })}
      </svg>

      <div style={{ textAlign: "center", opacity: textOpacity, transition: "opacity 300ms ease" }}>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A" }}>
          EuroPrix
        </div>
        <div style={{ fontSize: 12, fontFamily: "ui-monospace,monospace", letterSpacing: "0.25em", textTransform: "uppercase", color: "#475569", marginTop: 8 }}>
          Comparateur européen
        </div>
      </div>
    </div>
  )
}

export default function IntroSplash() {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const DUR = 2200
    const start = performance.now()
    let raf: number

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DUR)
      const eased = 1 - Math.pow(1 - p, 2.4)
      setProgress(eased)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setExiting(true), 350)
        setTimeout(() => setHidden(true), 1100)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (hidden) return null

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#fff",
        display: "grid", placeItems: "center",
        opacity: exiting ? 0 : 1,
        transition: "opacity 700ms cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <div
        style={{
          transform: exiting ? "scale(1.06)" : "scale(1)",
          transition: "transform 900ms cubic-bezier(0.2,0.7,0.2,1)",
        }}
      >
        <AnimatedLogo progress={progress} />
      </div>
    </div>
  )
}
