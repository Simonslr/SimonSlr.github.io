"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { geoMercator, geoPath, geoCentroid } from "d3-geo"
import { feature } from "topojson-client"
import type { Topology, GeometryCollection } from "topojson-specification"
import type { GeoJSON } from "geojson"

const W = 960, H = 600, SCROLL_RANGE = 1800

// center=[4, 46] shifts the map south to include Spain (40°N) in the viewBox.
// scale=1000 (vs 1200) gives enough field of view so all three countries fit.
// With these values: Paris≈(451,228), Berlin≈(644,158), Madrid≈(346,490)
const projection = geoMercator().center([4, 46]).scale(1000).translate([W / 2, H / 2])
const pathGen    = geoPath(projection)

const MAIN_IDS: Record<string, number> = { FR: 250, DE: 276, ES: 724 }
const CTX_IDS = [826, 380, 528, 56, 756, 616, 208, 578, 752, 620, 40, 203, 300, 191]
const CAPITALS: Record<string, [number, number]> = {
  FR: [2.35, 48.85], DE: [13.41, 52.52], ES: [-3.70, 40.42],
}
// Position on the progress rail [0-1] for each country's "hold" centre
const RAIL_POS: Record<string, number> = { FR: 0.21, DE: 0.50, ES: 0.79 }

interface Country { code: string; name: string; color: string; market: string; tagline: string; zoom: number }
const COUNTRIES: Country[] = [
  { code: "FR", name: "France",    color: "#3b82f6", market: "Amazon.fr", tagline: "Livraison Prime incluse",   zoom: 3.8 },
  { code: "DE", name: "Allemagne", color: "#f59e0b", market: "Amazon.de", tagline: "Souvent le meilleur prix",  zoom: 3.4 },
  { code: "ES", name: "Espagne",   color: "#ef4444", market: "Amazon.es", tagline: "Avantages TVA européenne",  zoom: 3.0 },
]

// Static star field — generated once, client-only
function genStars() {
  const out: { x: number; y: number; r: number; o: number }[] = []
  for (let i = 0; i < 140; i++)
    out.push({ x: Math.random() * W, y: Math.random() * H, r: 0.4 + Math.random() * 0.6, o: 0.18 + Math.random() * 0.45 })
  for (let i = 0; i < 14; i++)
    out.push({ x: Math.random() * W, y: Math.random() * H, r: 1.1, o: 0.85 })
  return out
}

export default function EuroMap() {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const sectionRef   = useRef<HTMLElement>(null)
  const hintRef      = useRef<HTMLDivElement>(null)
  const svgRef       = useRef<SVGSVGElement>(null)
  const cameraRef    = useRef<SVGGElement>(null)

  const [geoData, setGeoData] = useState<{
    main: Record<string, { d: string; cx: number; cy: number }>
    ctx:  { id: number; d: string }[]
    caps: Record<string, { x: number; y: number }>
  } | null>(null)

  const [active, setActive]       = useState<Country | null>(null)
  const [progPct, setProgPct]     = useState(0)
  const [marketText, setMarketText] = useState("")
  // Stars are generated client-only (Math.random) to avoid SSR hydration mismatch
  const [stars, setStars] = useState<ReturnType<typeof genStars>>([])
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setStars(genStars()) }, [])

  // ── Load geography ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/data/world-110m.json").then(r => r.json()).then((topo: Topology) => {
      const geo = feature(topo, topo.objects.countries as GeometryCollection<GeoJSON.GeoJsonProperties>)
      const main: Record<string, { d: string; cx: number; cy: number }> = {}
      const ctx:  { id: number; d: string }[] = []
      geo.features.forEach(f => {
        const id = Number(f.id), d = pathGen(f) ?? ""
        const code = Object.keys(MAIN_IDS).find(k => MAIN_IDS[k] === id)
        if (code) { const [cx, cy] = projection(geoCentroid(f)) ?? [0, 0]; main[code] = { d, cx, cy } }
        else if (CTX_IDS.includes(id) && d) ctx.push({ id, d })
      })
      const caps: Record<string, { x: number; y: number }> = {}
      Object.entries(CAPITALS).forEach(([k, ll]) => { const [x, y] = projection(ll) ?? [0, 0]; caps[k] = { x, y } })
      setGeoData({ main, ctx, caps })
    })
  }, [])

  // ── Typewriter on market name ─────────────────────────────────────────────
  const startType = (text: string) => {
    if (typeTimerRef.current) clearInterval(typeTimerRef.current)
    setMarketText("")
    let i = 0
    typeTimerRef.current = setInterval(() => {
      if (i >= text.length) { clearInterval(typeTimerRef.current!); return }
      setMarketText(text.slice(0, ++i))
    }, 42)
  }

  // ── GSAP animation + scroll driver ───────────────────────────────────────
  useEffect(() => {
    if (!geoData) return
    const section = sectionRef.current, wrapper = wrapperRef.current
    const hint = hintRef.current, svg = svgRef.current, cam = cameraRef.current
    if (!section || !wrapper || !svg || !cam) return
    let disposed = false

    const q = <T extends SVGElement>(sel: string) => svg.querySelector<T>(sel)
    const getPath  = (code: string) => q<SVGPathElement>(`#em-path-${code}`)
    const getScan  = (code: string) => q<SVGPathElement>(`#em-scan-${code}`)
    const getGrad  = (code: string) => svg.querySelector<SVGLinearGradientElement>(`#scan-grad-${code}`)

    // ── Entry animation: context countries cascade in ─────────────────────
    const ctxEls = Array.from(svg.querySelectorAll<SVGPathElement>(".em-ctx"))
    gsap.set(ctxEls, { opacity: 0, scale: 0.96, transformOrigin: "center center" })
    gsap.to(ctxEls, { opacity: 1, scale: 1, duration: 0.9, stagger: 0.025, ease: "power2.out", delay: 0.15 })
    COUNTRIES.forEach((c, i) => {
      const el = getPath(c.code); if (!el) return
      gsap.set(el, { opacity: 0 })
      gsap.to(el, { opacity: 1, duration: 0.8, delay: 0.5 + i * 0.12, ease: "power2.out" })
    })
    gsap.set(cam, { scale: 1 })

    // ── Scroll timeline ───────────────────────────────────────────────────
    const seq = gsap.timeline({ paused: true })
    const [FR, DE, ES] = COUNTRIES

    // White flash on every transition
    const flash = (at: number) => {
      const r = q<SVGRectElement>("#em-flash"); if (!r) return
      seq.to(r, { opacity: 0.30, duration: 0.012, ease: "power2.in" }, at)
      seq.to(r, { opacity: 0,    duration: 0.022, ease: "power2.out" }, at + 0.012)
    }

    // Spotlight: dim inactive countries
    const spotlight = (code: string | null, at: number) => {
      COUNTRIES.forEach(c => {
        const el = getPath(c.code); if (!el) return
        seq.to(el, { opacity: code && c.code !== code ? 0.32 : 1, duration: 0.10 }, at)
      })
      const ctxLayer = q<SVGGElement>("#ctx-layer")
      if (ctxLayer) seq.to(ctxLayer, { opacity: code ? 0.5 : 1, duration: 0.10 }, at)
    }

    // Scan gradient sweep (L→R bar of color across the country)
    const scanIn = (code: string, at: number) => {
      const c = COUNTRIES.find(x => x.code === code)!
      const grad = getGrad(code), scanPath = getScan(code)
      if (!grad || !scanPath) return
      const [r, g, b] = [c.color.slice(1,3), c.color.slice(3,5), c.color.slice(5,7)].map(h => parseInt(h, 16))
      seq.set(grad, { attr: { x1: -W, x2: -W * 0.5 } }, at)
      seq.set(scanPath, { opacity: 1 }, at)
      seq.to(grad, { attr: { x1: W * 1.5, x2: W * 2 }, duration: 0.18, ease: "power2.out" }, at)
      seq.to(getPath(code)!, {
        attr: { fill: `rgba(${r},${g},${b},0.22)`, stroke: c.color + "cc", strokeWidth: 1.4 },
        filter: `drop-shadow(0 0 28px ${c.color}55) drop-shadow(0 0 8px ${c.color}99)`,
        duration: 0.10,
      }, at + 0.06)
      seq.to(scanPath, { opacity: 0, duration: 0.06 }, at + 0.18)
    }
    const scanOff = (code: string, at: number) => {
      seq.to(getPath(code)!, {
        attr: { fill: "rgba(255,255,255,0.05)", stroke: "rgba(255,255,255,0.20)", strokeWidth: 0.8 },
        filter: "none", duration: 0.08,
      }, at)
    }

    // Beam: glowing trail streaks from capital to capital
    const beamTrace = (fromCode: string, toCode: string, at: number) => {
      const trail = q<SVGPathElement>("#em-beam-trail"), head = q<SVGCircleElement>("#em-beam-head")
      if (!trail || !head) return
      const a = geoData.caps[fromCode], b = geoData.caps[toCode]; if (!a || !b) return
      const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - Math.abs(b.x - a.x) * 0.08
      const d = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`
      const pathLen = Math.hypot(b.x - a.x, b.y - a.y) * 1.08
      seq.set(trail, { attr: { d, strokeDasharray: `28 ${pathLen}`, strokeDashoffset: pathLen }, opacity: 0.95 }, at)
      seq.to(trail, { attr: { strokeDashoffset: -28 }, duration: 0.16, ease: "power2.inOut" }, at)
      seq.to(trail, { opacity: 0, duration: 0.08, ease: "power2.out" }, at + 0.10)
      seq.set(head, { attr: { cx: a.x, cy: a.y, r: 4 }, opacity: 1 }, at)
      seq.to(head,  { attr: { cx: b.x, cy: b.y, r: 2 }, opacity: 0, duration: 0.18, ease: "power2.inOut" }, at)
    }

    // ── No zoom — static map, ball travels between capitals ──────────────────
    // Camera stays at scale=1. The animation IS the colored ball that circulates
    // Paris → Berlin → Madrid → Paris, with each country lighting up on arrival.
    gsap.set(cam, { x: 0, y: 0, scale: 1 })

    // Ball element
    const ball  = q<SVGCircleElement>("#em-beam-head")
    const trail = q<SVGPathElement>("#em-beam-trail")
    if (!ball) return

    // Soft ambient glow on all 3 countries from the start (they're always visible)
    COUNTRIES.forEach(c => {
      const el = getPath(c.code); if (!el) return
      gsap.set(el, {
        attr: { fill: `${c.color}12`, stroke: `${c.color}55`, strokeWidth: 0.9 },
        filter: `drop-shadow(0 0 10px ${c.color}30)`,
      })
    })

    // Helper: animate ball from capital A to capital B + draw trail + arrival glow
    // The ball follows the EXACT quadratic bezier using a proxy + onUpdate —
    // animating cx/cy directly creates straight-line motion; the proxy approach
    // computes B(t) = (1-t)²P0 + 2(1-t)t·P1 + t²P2 at every frame.
    const travel = (fromCode: string, toCode: string, at: number, dur: number) => {
      const a = geoData.caps[fromCode], b = geoData.caps[toCode]
      const toC = COUNTRIES.find(c => c.code === toCode)!
      if (!a || !b || !ball) return

      const mx = (a.x + b.x) / 2
      const my = Math.min(a.y, b.y) - Math.abs(b.x - a.x) * 0.09
      const pathD = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`
      const pathLen = Math.hypot(b.x - a.x, b.y - a.y) * 1.09

      // Trail: strokes itself along the bezier as ball progresses
      if (trail) {
        seq.set(trail, {
          attr: { d: pathD, strokeDasharray: `${pathLen * 0.18} ${pathLen}`, strokeDashoffset: pathLen },
          stroke: toC.color, opacity: 0.80,
        }, at)
        seq.to(trail, { attr: { strokeDashoffset: 0 }, opacity: 0.45, duration: dur, ease: "none" }, at)
        seq.to(trail, { opacity: 0, duration: 0.08 }, at + dur + 0.02)
      }

      // Ball: proxy drives the bezier interpolation each frame
      // Captures local copies so the closure is stable across multiple travel() calls
      const ax = a.x, ay = a.y, bx = b.x, by = b.y
      const proxy = { t: 0 }
      seq.set(ball, { fill: toC.color, opacity: 1, attr: { r: 5, cx: ax, cy: ay } }, at)
      seq.fromTo(proxy, { t: 0 }, {
        t: 1, duration: dur, ease: "power2.inOut",
        onUpdate() {
          const t  = proxy.t
          const px = (1-t)*(1-t)*ax + 2*(1-t)*t*mx + t*t*bx
          const py = (1-t)*(1-t)*ay + 2*(1-t)*t*my + t*t*by
          ball!.setAttribute("cx", px.toFixed(2))
          ball!.setAttribute("cy", py.toFixed(2))
        },
      }, at)

      // Arrival: country lights up — no flash, just smooth glow transition
      scanIn(toCode, at + dur * 0.88)
      spotlight(toCode, at + dur * 0.90)
    }

    const deactivate = (code: string, at: number) => {
      const c = COUNTRIES.find(x => x.code === code)!
      const el = getPath(code); if (!el) return
      // Return to ambient soft glow (not full off — they stay warmly lit)
      seq.to(el, {
        attr: { fill: `${c.color}12`, stroke: `${c.color}44`, strokeWidth: 0.9 },
        filter: `drop-shadow(0 0 10px ${c.color}25)`,
        duration: 0.09,
      }, at)
      spotlight(null, at)
    }

    // ── Timeline ───────────────────────────────────────────────────────────
    // 0.00–0.12  intro — ball appears at Paris, FR lights up
    // 0.12–0.38  ball travels Paris → Berlin
    // 0.38–0.55  hold at Berlin (DE glowing)
    // 0.55–0.78  ball travels Berlin → Madrid
    // 0.78–0.92  hold at Madrid (ES glowing)
    // 0.92–1.00  fade out

    // Intro: France awakens first, ball fades in at Paris — no flash
    scanIn("FR", 0.04)
    spotlight("FR", 0.06)
    const frCap = geoData.caps.FR
    seq.set(ball, { attr: { cx: frCap?.x ?? W/2, cy: frCap?.y ?? H/2, r: 5 },
      fill: FR.color, opacity: 0 }, 0.04)
    seq.to(ball, { opacity: 1, duration: 0.08, ease: "power2.out" }, 0.06)

    // FR → DE  (no flash on arrival — smooth scan transition does the job)
    deactivate("FR", 0.12)
    travel("FR", "DE", 0.14, 0.22)

    // DE → ES
    deactivate("DE", 0.56)
    travel("DE", "ES", 0.58, 0.20)

    // Fade out
    seq.to(ball, { opacity: 0, duration: 0.06 }, 0.93)
    seq.duration(1)

    // ── Mobile: skip scroll-driven animation entirely ────────────────────
    // On small screens the sticky+lerp is fragile on iOS Safari.
    // Instead auto-play the timeline once at normal speed.
    if (window.innerWidth <= 860) {
      let loopCall: ReturnType<typeof gsap.delayedCall> | null = null
      seq.play()
      seq.eventCallback("onComplete", () => {
        loopCall = gsap.delayedCall(1.5, () => { if (!disposed) seq.restart() })
      })
      return () => {
        disposed = true; seq.kill(); loopCall?.kill()
        if (typeTimerRef.current) clearInterval(typeTimerRef.current)
      }
    }

    // ── Desktop: lerp-smoothed scroll driver ──────────────────────────────
    const lerp = { target: 0, current: 0 }, LERP_K = 0.22
    let cur: Country | null = null, holdActive = false, hintHidden = false
    let rafId = 0

    const upd = (c: Country | null) => {
      if ((c?.code ?? null) === (cur?.code ?? null)) return
      cur = c
      setActive(c)
      if (c) startType(c.market)
      else { if (typeTimerRef.current) clearInterval(typeTimerRef.current); setMarketText("") }
    }
    const setHint = (on: boolean) => {
      if (on === hintHidden || !hint) return; hintHidden = on
      hint.style.opacity = on ? "0" : "1"
      hint.style.transform = `translateX(-50%) translateY(${on ? "10px" : "0"})`
    }

    const applyP = (p: number) => {
      seq.progress(p)
      setHint(p > 0.03)
      setProgPct(p * 100)
      let act: Country | null = null, hold = false
      if      (p > 0.04 && p < 0.14) { act = FR; hold = p > 0.07 && p < 0.12 }
      else if (p > 0.14 && p < 0.36) { act = FR } // FR→DE travel: keep FR label visible
      else if (p > 0.36 && p < 0.57) { act = DE; hold = p > 0.40 && p < 0.55 }
      else if (p > 0.57 && p < 0.78) { act = DE } // DE→ES travel: keep DE label visible
      else if (p > 0.78 && p < 0.93) { act = ES; hold = p > 0.82 && p < 0.91 }
      upd(act); holdActive = hold
    }

    const lerpLoop = () => {
      if (disposed) return
      const diff = lerp.target - lerp.current
      if (Math.abs(diff) > 0.00003) lerp.current += diff * LERP_K
      else lerp.current = lerp.target
      applyP(Math.max(0, Math.min(1, lerp.current)))
      rafId = requestAnimationFrame(lerpLoop)
    }
    rafId = requestAnimationFrame(lerpLoop)

    const computeP = (s: number) => Math.max(0, Math.min(1, (s - wrapper.offsetTop) / SCROLL_RANGE))

    // ── Micro Y-drift while holding (organic life, ±0.5px) ───────────────
    let driftId = 0
    const driftLoop = () => {
      if (!disposed && svgRef.current) {
        const dy = holdActive ? Math.sin(performance.now() * 0.001 * 0.6 * Math.PI * 2) * 0.5 : 0
        svgRef.current.style.transform = `translateY(${dy.toFixed(3)}px)`
      }
      driftId = requestAnimationFrame(driftLoop)
    }
    driftId = requestAnimationFrame(driftLoop)

    let lenisHandler: ((e: { scroll: number }) => void) | null = null
    let lenisTimer: ReturnType<typeof setTimeout> | null = null
    let fallbackFn: (() => void) | null = null
    let attempts = 0

    const attach = () => {
      if (disposed) return
      const lenis = (window as any).__lenis
      if (!lenis) {
        if (++attempts < 25) { lenisTimer = setTimeout(attach, 150) }
        else { fallbackFn = () => { lerp.target = computeP(window.scrollY) }; window.addEventListener("scroll", fallbackFn, { passive: true }) }
        return
      }
      lenisHandler = ({ scroll }: { scroll: number }) => { lerp.target = computeP(scroll) }
      lenis.on("scroll", lenisHandler)
      lerp.target = computeP(window.scrollY)
    }
    lenisTimer = setTimeout(attach, 120)

    return () => {
      disposed = true; seq.kill()
      cancelAnimationFrame(rafId); cancelAnimationFrame(driftId)
      if (lenisTimer) clearTimeout(lenisTimer)
      const lenis = (window as any).__lenis
      if (lenis && lenisHandler) lenis.off("scroll", lenisHandler)
      if (fallbackFn) window.removeEventListener("scroll", fallbackFn)
      if (typeTimerRef.current) clearInterval(typeTimerRef.current)
    }
  }, [geoData])

  const activeColor = active?.color ?? "rgba(255,255,255,0.9)"

  return (
    <div ref={wrapperRef} className="globe-hero-wrapper">
      <section ref={sectionRef} className="globe-hero-section euro-map" data-hero="dark">

        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="euro-map__svg"
             aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="em-space" cx="50%" cy="50%" r="70%">
              <stop offset="0%"   stopColor="#050d1a" />
              <stop offset="55%"  stopColor="#020610" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            {/* Per-country scan gradients — GSAP tweens x1/x2 to sweep L→R */}
            {COUNTRIES.map(c => (
              <linearGradient key={c.code} id={`scan-grad-${c.code}`}
                x1="-960" y1="0" x2="-480" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor={c.color} stopOpacity="0"    />
                <stop offset="40%"  stopColor={c.color} stopOpacity="0.55" />
                <stop offset="60%"  stopColor={c.color} stopOpacity="0.55" />
                <stop offset="100%" stopColor={c.color} stopOpacity="0"    />
              </linearGradient>
            ))}

            {/* Beam trail gradient */}
            <linearGradient id="em-trail-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0"    />
              <stop offset="75%"  stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1"    />
            </linearGradient>

            <filter id="em-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="em-glow-soft" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            <pattern id="em-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0"  y2="60" stroke="rgba(255,255,255,0.028)" strokeWidth="0.4" />
              <line x1="0" y1="0" x2="60" y2="0"  stroke="rgba(255,255,255,0.028)" strokeWidth="0.4" />
            </pattern>
          </defs>

          {/* Deep-space background */}
          <rect width={W} height={H} fill="url(#em-space)" />
          <rect width={W} height={H} fill="url(#em-grid)" />

          {/* Static star field */}
          <g id="em-stars">
            {stars.map((s, i) => (
              <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)}
                r={s.r.toFixed(2)} fill="#fff" opacity={s.o.toFixed(2)} />
            ))}
          </g>

          {/* Camera group — everything that pan-zooms */}
          <g ref={cameraRef} id="camera">
            <g id="ctx-layer">
              {geoData?.ctx.map(c => (
                <path key={c.id} d={c.d} className="em-ctx"
                  fill="rgba(255,255,255,0.025)"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.55" strokeLinejoin="round" />
              ))}
            </g>

            {/* Connection lines between capitals */}
            {geoData && (() => {
              const { FR: fr, DE: de, ES: es } = geoData.caps
              if (!fr || !de || !es) return null
              const arc = (a: typeof fr, b: typeof fr, dy: number) =>
                `M ${a.x} ${a.y} Q ${(a.x+b.x)/2} ${Math.min(a.y,b.y)+dy} ${b.x} ${b.y}`
              return (
                <g opacity="0.32">
                  <path d={arc(fr, de, -22)} fill="none" stroke="rgba(255,255,255,0.22)"
                    strokeWidth="0.7" strokeDasharray="3 9" className="em-dash" />
                  <path d={arc(fr, es,  16)} fill="none" stroke="rgba(255,255,255,0.22)"
                    strokeWidth="0.7" strokeDasharray="3 9" className="em-dash em-dash--b" />
                </g>
              )
            })()}

            {/* Main 3 countries */}
            {COUNTRIES.map(c => (
              <path key={c.code} id={`em-path-${c.code}`}
                d={geoData?.main[c.code]?.d ?? ""}
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.20)"
                strokeWidth="0.8" strokeLinejoin="round" />
            ))}

            {/* Scan overlay paths — filled with animated scan gradient */}
            {COUNTRIES.map(c => (
              <path key={`scan-${c.code}`} id={`em-scan-${c.code}`}
                d={geoData?.main[c.code]?.d ?? ""}
                fill={`url(#scan-grad-${c.code})`}
                opacity="0" pointerEvents="none" />
            ))}

            {/* Capital markers */}
            {geoData && COUNTRIES.map(c => {
              const p = geoData.caps[c.code]; if (!p) return null
              return (
                <g key={`cap-${c.code}`}>
                  <circle cx={p.x} cy={p.y} r="6" fill="none"
                    stroke="rgba(255,255,255,0.20)" strokeWidth="0.6">
                    <animate attributeName="r" from="6" to="20" dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.55" to="0" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={p.x} cy={p.y} r="2.5" fill="white" opacity="0.95" />
                </g>
              )
            })}

            {/* Beam trail + head */}
            <path id="em-beam-trail" d="" fill="none"
              stroke="url(#em-trail-grad)" strokeWidth="2.4" strokeLinecap="round"
              opacity="0" filter="url(#em-glow-soft)" />
            <circle id="em-beam-head" cx="0" cy="0" r="3"
              fill="#fff" opacity="0" filter="url(#em-glow-soft)" />
          </g>

          {/* White transition flash — sits above camera */}
          <rect id="em-flash" width={W} height={H} fill="#ffffff" opacity="0" pointerEvents="none" />
        </svg>

        {/* Vertical progress rail — right edge */}
        <div className="em-progress" style={{ '--prog-color': activeColor } as React.CSSProperties}>
          <div className="em-progress__fill"
               style={{ height: `${progPct}%`, background: activeColor === "rgba(255,255,255,0.9)"
                 ? "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.5))"
                 : `linear-gradient(to bottom, ${activeColor}, ${activeColor}88)` }} />
          {COUNTRIES.map(c => {
            const isActive = active?.code === c.code
            const isPassed = progPct / 100 >= RAIL_POS[c.code]
            return (
              <div key={c.code} className={`em-progress__node ${isActive ? "is-active" : ""} ${isPassed && !isActive ? "is-passed" : ""}`}
                   style={{ top: `${RAIL_POS[c.code] * 100}%`, '--node-color': c.color } as React.CSSProperties}>
                <span className="em-progress__label">{c.code}</span>
              </div>
            )
          })}
        </div>

        {/* Country label HUD */}
        <div className={`em-label-hud ${active ? "is-visible" : ""}`}
             style={{ color: activeColor }}>
          <div className="em-label-hud__rule" />
          <div className="em-label-hud__market">
            {marketText}<span className="em-label-hud__cursor">▌</span>
          </div>
          <div className="em-label-hud__name">{active?.name ?? ""}</div>
          <div className="em-label-hud__tag">{active?.tagline ?? ""}</div>
        </div>

        <div ref={hintRef} className="globe-hero-hint" aria-hidden="true">
          <span>Scroll</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M4.5 1V12M1 8.5L4.5 12L8 8.5"
              stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>
    </div>
  )
}
