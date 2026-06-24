"use client"

import { useRef, useState, useEffect } from "react"
import { ARROWS, STARS, StarShape, STAR_SIZE } from "./CompareUroLogo"

type WindowWithSplash = Window & typeof globalThis & { __introSplashDone?: boolean }

// Signals HeroText that the splash has started exiting (or never played),
// so the hero's line reveal isn't wasted while hidden behind it.
function markSplashDone() {
  ;(window as WindowWithSplash).__introSplashDone = true
  window.dispatchEvent(new Event("introsplash:done"))
}

const DASH = 100

// Applies one animation frame directly to the DOM via refs — no React
// state/re-render per frame, so the 1.6s animation doesn't compete with
// hero content for main-thread time on slower (mobile) CPUs.
function applyProgress(progress: number, refs: {
  arrowPaths: (SVGPathElement | null)[]
  arrowHeads: (SVGGElement | null)[]
  stars: (SVGGElement | null)[]
  text: HTMLDivElement | null
}) {
  const arrowProg   = Math.min(1, progress / 0.55)
  const starsProg   = Math.max(0, (progress - 0.55) / 0.45)
  const textOpacity = progress > 0.9 ? (progress - 0.9) / 0.1 : 0
  const headOpacity = arrowProg > 0.85 ? (arrowProg - 0.85) / 0.15 : 0

  refs.arrowPaths.forEach((el) => el?.setAttribute("stroke-dashoffset", String(DASH * (1 - arrowProg))))
  refs.arrowHeads.forEach((el) => { if (el) el.style.opacity = String(headOpacity) })
  refs.stars.forEach((el, i) => {
    if (!el) return
    const localProg = Math.max(0, Math.min(1, (starsProg - (i / 12) * 0.5) * 2.5))
    el.style.opacity = String(localProg)
    el.style.transform = `scale(${0.6 + 0.4 * localProg})`
  })
  if (refs.text) refs.text.style.opacity = String(textOpacity)
}

function AnimatedLogo({ refsRef }: { refsRef: React.MutableRefObject<{
  arrowPaths: (SVGPathElement | null)[]
  arrowHeads: (SVGGElement | null)[]
  stars: (SVGGElement | null)[]
  text: HTMLDivElement | null
}> }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <svg width={240} height={240} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
        {ARROWS.map((a, i) => (
          <g key={i}>
            <path
              ref={(el) => { refsRef.current.arrowPaths[i] = el }}
              d={a.d}
              stroke="#ffffff"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={DASH}
            />
            <g
              ref={(el) => { refsRef.current.arrowHeads[i] = el }}
              transform={`translate(${a.hx} ${a.hy}) rotate(${a.hang})`}
              style={{ opacity: 0 }}
            >
              <polygon points="0,0 10,4 10,-4" fill="#ffffff" />
            </g>
          </g>
        ))}
        {STARS.map((s, i) => (
          <g
            key={i}
            ref={(el) => { refsRef.current.stars[i] = el }}
            style={{ opacity: 0, transform: "scale(0.6)", transformOrigin: `${s.x}px ${s.y}px` }}
          >
            <StarShape cx={s.x} cy={s.y} r={STAR_SIZE} fill="#ffffff" />
          </g>
        ))}
      </svg>
      <div ref={(el) => { refsRef.current.text = el }} style={{ textAlign: "center", opacity: 0, transition: "opacity 300ms ease" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>
          ComparEuro
        </div>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
          Comparateur de prix
        </div>
      </div>
    </div>
  )
}

export default function IntroSplash() {
  const [mounted, setMounted] = useState(false)
  const [skip, setSkip] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)

  const refsRef = useRef<{
    arrowPaths: (SVGPathElement | null)[]
    arrowHeads: (SVGGElement | null)[]
    stars: (SVGGElement | null)[]
    text: HTMLDivElement | null
  }>({ arrowPaths: [], arrowHeads: [], stars: [], text: null })

  // Hook 1 : montage — vérifie sessionStorage pour ne jouer qu'une fois par session
  useEffect(() => {
    if (sessionStorage.getItem("splash_done")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSkip(true)
      markSplashDone()
    } else {
      sessionStorage.setItem("splash_done", "1")
    }
    setMounted(true)
  }, [])

  // Hook 2 : animation — pilotée par refs (pas de re-render React par frame)
  useEffect(() => {
    if (!mounted || skip) return
    const DUR = 1600
    const start = performance.now()
    let raf: number
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DUR)
      applyProgress(1 - Math.pow(1 - p, 2.4), refsRef.current)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setExiting(true)
          markSplashDone()
        }, 350)
        setTimeout(() => setHidden(true), 1100)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mounted, skip])

  // Returns conditionnels APRÈS tous les hooks
  if (!mounted || hidden || skip) return null

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#000000",
        display: "grid", placeItems: "center",
        opacity: exiting ? 0 : 1,
        transition: "opacity 700ms cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <div style={{ transform: exiting ? "scale(1.06)" : "scale(1)", transition: "transform 900ms cubic-bezier(0.2,0.7,0.2,1)" }}>
        <AnimatedLogo refsRef={refsRef} />
      </div>
    </div>
  )
}
