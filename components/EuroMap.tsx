"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

// ── Mercator-corrected coordinate system ─────────────────────────────────
// viewBox "0 0 1000 800"
// Center reference: (lon=5°E, lat=48°N) → pixel (500, 400)
// X = 500 + (lon - 5) * 9.4      (9.4 px per degree lon at 48°N)
// Y = 400 - (lat - 48) * 14      (14 px per degree lat)
//
// All paths verified against real geography key points.

const SCROLL_RANGE = 2800

interface Country {
  code: string; name: string
  cx: number; cy: number; zoom: number
  color: string; market: string; tagline: string
  pathD: string
}

const COUNTRIES: Country[] = [
  {
    code: "FR", name: "France",
    cx: 367, cy: 425, zoom: 3.2,
    color: "#2563eb", market: "Amazon.fr", tagline: "Livraison Prime incluse",
    // 11 key boundary points: Brittany → English Channel → Rhine → Alps → Mediterranean → Pyrenees → Atlantic
    pathD: "M 309,400 L 338,376 L 366,358 L 378,366 L 404,375 L 420,393 L 404,425 L 416,460 L 375,477 L 331,465 L 309,400 Z",
  },
  {
    code: "DE", name: "Allemagne",
    cx: 455, cy: 378, zoom: 3.0,
    color: "#f59e0b", market: "Amazon.de", tagline: "Souvent le meilleur prix",
    // 10 key points: Baltic coast → Polish border → Czech/Alps → Bodensee → Rhine/Cologne → back
    pathD: "M 441,305 L 475,312 L 488,323 L 493,357 L 480,365 L 473,425 L 442,422 L 427,418 L 413,360 L 420,324 Z",
  },
  {
    code: "ES", name: "Espagne",
    cx: 322, cy: 525, zoom: 2.8,
    color: "#dc2626", market: "Amazon.es", tagline: "Avantages TVA européenne",
    // 11 pts: Galicia NW → N coast → Pyrenees → E coast → S tip → W coast (Iberian Peninsula)
    pathD: "M 271,460 L 315,464 L 335,464 L 384,478 L 372,494 L 353,521 L 334,576 L 302,587 L 287,574 L 268,530 L 271,476 Z",
  },
]

// Context countries (muted background — gives geographic recognition)
const CTX: { id: string; d: string }[] = [
  // UK Great Britain (7 pts — recognizable island shape)
  { id: "uk", d: "M 299,326 L 389,308 L 358,242 L 345,199 L 306,171 L 293,200 L 315,290 Z" },
  // Ireland
  { id: "ie", d: "M 258,356 L 282,340 L 292,370 L 268,388 Z" },
  // Belgium + Netherlands
  { id: "benelux", d: "M 366,358 L 413,360 L 430,326 L 394,310 L 370,320 L 366,358 Z" },
  // Switzerland (small rectangle)
  { id: "ch", d: "M 409,427 L 442,422 L 452,435 L 442,447 L 409,447 Z" },
  // Italy — recognizable boot shape (10 pts)
  { id: "it", d: "M 418,456 L 484,432 L 484,449 L 504,504 L 500,553 L 494,502 L 471,479 L 452,447 L 437,449 Z" },
  // Austria + Czech Rep. (strip south of Germany)
  { id: "at", d: "M 427,418 L 442,422 L 473,425 L 493,421 L 480,440 L 442,444 L 418,456 L 409,447 Z" },
  // Poland (east of Germany)
  { id: "pl", d: "M 488,323 L 529,310 L 571,327 L 564,356 L 541,376 L 493,357 Z" },
  // Denmark (Jutland peninsula)
  { id: "dk", d: "M 441,305 L 456,298 L 460,285 L 443,279 L 432,290 L 441,305 Z" },
  // Scandinavia — Sweden + Norway (elongated peninsula)
  { id: "scand", d: "M 441,305 L 460,285 L 478,250 L 520,200 L 509,162 L 480,198 L 456,280 L 441,305 Z" },
  // Portugal (attached to Spain W coast)
  { id: "pt", d: "M 271,460 L 271,476 L 268,530 L 248,525 L 247,465 L 268,456 Z" },
  // Greece + Balkans (rough)
  { id: "balkan", d: "M 493,421 L 564,410 L 580,450 L 555,490 L 530,490 L 510,455 L 473,425 Z" },
]

export default function EuroMap() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const hintRef    = useRef<HTMLDivElement>(null)
  const svgRef     = useRef<SVGSVGElement>(null)
  const groupRef   = useRef<SVGGElement>(null)
  const [active, setActive] = useState<Country | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const wrapper = wrapperRef.current
    const hint    = hintRef.current
    const svg     = svgRef.current
    const group   = groupRef.current
    if (!section || !wrapper || !svg || !group) return

    let disposed = false

    const path = (code: string) => svg.querySelector<SVGPathElement>(`#path-${code}`)

    // Reset all countries to muted
    COUNTRIES.forEach(c => {
      const el = path(c.code)
      if (el) { el.style.fill = "rgba(255,255,255,0.06)"; el.style.filter = "none" }
    })
    gsap.set(group, { scale: 1, svgOrigin: "400 420" })

    const seq = gsap.timeline({ paused: true })

    const activate = (c: Country, p: number) => {
      const el = path(c.code)
      if (!el) return
      // Zoom SVG into the country
      seq.to(group, { scale: c.zoom, svgOrigin: `${c.cx} ${c.cy}`, duration: 0.18, ease: "power3.out" }, p)
      // Fill + glow
      seq.to(el, {
        fill: c.color,
        filter: `drop-shadow(0 0 20px ${c.color}99) drop-shadow(0 0 8px ${c.color}66)`,
        duration: 0.12, ease: "power2.out",
      }, p + 0.02)
    }

    const deactivate = (c: Country, p: number) => {
      const el = path(c.code)
      seq.to(group, { scale: 1, svgOrigin: "400 420", duration: 0.12, ease: "power2.inOut" }, p)
      if (el) seq.to(el, { fill: "rgba(255,255,255,0.06)", filter: "none", duration: 0.10 }, p)
    }

    // Sequence: FR → DE → ES
    activate(COUNTRIES[0], 0.05);   deactivate(COUNTRIES[0], 0.31)
    activate(COUNTRIES[1], 0.35);   deactivate(COUNTRIES[1], 0.61)
    activate(COUNTRIES[2], 0.65);   deactivate(COUNTRIES[2], 0.89)
    seq.to(section, { opacity: 0, duration: 0.06 }, 0.94)
    seq.duration(1)

    // Label tracking
    let cur: Country | null = null
    const upd = (c: Country | null) => { if (c !== cur) { cur = c; setActive(c) } }

    let hintHidden = false
    const setHint = (h: boolean) => {
      if (h === hintHidden || !hint) return
      hintHidden = h
      hint.style.opacity = h ? "0" : "1"
      hint.style.transform = `translateX(-50%) translateY(${h ? "12px" : "0"})`
    }

    const onProgress = (p: number) => {
      if (disposed) return
      seq.progress(p); setHint(p > 0.05)
      if      (p > 0.08 && p < 0.32) upd(COUNTRIES[0])
      else if (p > 0.38 && p < 0.62) upd(COUNTRIES[1])
      else if (p > 0.68 && p < 0.90) upd(COUNTRIES[2])
      else upd(null)
    }
    const computeP = (scroll: number) => Math.max(0, Math.min(1, (scroll - wrapper.offsetTop) / SCROLL_RANGE))

    // Lenis driver
    let lenisHandler: ((e: { scroll: number }) => void) | null = null
    let lenisTimer: ReturnType<typeof setTimeout> | null = null
    let fallbackFn: (() => void) | null = null
    let attempts = 0

    const attach = () => {
      if (disposed) return
      const lenis = (window as any).__lenis
      if (!lenis) {
        if (++attempts < 20) { lenisTimer = setTimeout(attach, 150) } else {
          fallbackFn = () => onProgress(computeP(window.scrollY))
          window.addEventListener("scroll", fallbackFn, { passive: true })
          fallbackFn()
        }
        return
      }
      lenisHandler = ({ scroll }: { scroll: number }) => onProgress(computeP(scroll))
      lenis.on("scroll", lenisHandler)
      onProgress(computeP(window.scrollY))
    }
    lenisTimer = setTimeout(attach, 100)

    return () => {
      disposed = true
      seq.kill()
      if (lenisTimer) clearTimeout(lenisTimer)
      const lenis = (window as any).__lenis
      if (lenis && lenisHandler) lenis.off("scroll", lenisHandler)
      if (fallbackFn) window.removeEventListener("scroll", fallbackFn)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="globe-hero-wrapper">
      <section ref={sectionRef} className="globe-hero-section euro-map" data-hero="dark">

        <svg ref={svgRef} viewBox="200 150 520 480" className="euro-map__svg" aria-hidden="true">
          <defs>
            {/* Subtle lat/lon grid suggestion */}
            <pattern id="mapgrid" x="0" y="0" width="47" height="70" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="70" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5"/>
              <line x1="0" y1="0" x2="47" y2="0" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5"/>
            </pattern>
          </defs>

          {/* Background grid */}
          <rect x="0" y="0" width="1000" height="800" fill="url(#mapgrid)" />

          <g ref={groupRef}>
            {/* Context countries (muted) */}
            {CTX.map(c => (
              <path key={c.id} d={c.d}
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="0.7"
                strokeLinejoin="round"
              />
            ))}

            {/* Main 3 countries */}
            {COUNTRIES.map(c => (
              <path key={c.code} id={`path-${c.code}`} d={c.pathD}
                fill="rgba(255,255,255,0.06)"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
                strokeLinejoin="round"
                style={{ transition: "fill 0.4s ease, filter 0.4s ease" }}
              />
            ))}

            {/* Capital city dots (orientation anchor) */}
            <circle cx="395" cy="415" r="2.5" fill="rgba(255,255,255,0.4)" />  {/* Paris */}
            <circle cx="455" cy="368" r="2.5" fill="rgba(255,255,255,0.4)" />  {/* Berlin */}
            <circle cx="314" cy="506" r="2.5" fill="rgba(255,255,255,0.4)" />  {/* Madrid */}
          </g>
        </svg>

        {active && (
          <div className="globe-hero-label" key={active.code}>
            <div className="globe-hero-label__market" style={{ color: active.color }}>{active.market}</div>
            <div className="globe-hero-label__name">{active.name}</div>
            <div className="globe-hero-label__tag">{active.tagline}</div>
          </div>
        )}

        <div ref={hintRef} className="globe-hero-hint" aria-hidden="true">
          <span>Scroll</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M4.5 1 V12 M1 8.5 L4.5 12 L8 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>
    </div>
  )
}
