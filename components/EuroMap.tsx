"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { geoMercator, geoPath, geoCentroid } from "d3-geo"
import { feature } from "topojson-client"
import type { Topology, GeometryCollection } from "topojson-specification"
import type { GeoJSON } from "geojson"

const W = 960, H = 600, SCROLL_RANGE = 1800

const projection = geoMercator().center([4, 46]).scale(1000).translate([W / 2, H / 2])
const pathGen    = geoPath(projection)

const MAIN_IDS: Record<string, number> = { FR: 250, DE: 276, ES: 724 }
const CTX_IDS = [826, 380, 528, 56, 756, 616, 208, 578, 752, 620, 40, 203, 300, 191]
const CAPITALS: Record<string, [number, number]> = {
  FR: [2.35, 48.85], DE: [13.41, 52.52], ES: [-3.70, 40.42],
}
const RAIL_POS: Record<string, number> = { FR: 0.21, DE: 0.50, ES: 0.79 }

interface Country { code: string; name: string; color: string; market: string; tagline: string; zoom: number }
const COUNTRIES: Country[] = [
  { code: "FR", name: "France",    color: "#3b82f6", market: "Amazon.fr", tagline: "Livraison Prime incluse",   zoom: 3.8 },
  { code: "DE", name: "Allemagne", color: "#f59e0b", market: "Amazon.de", tagline: "Souvent le meilleur prix",  zoom: 3.4 },
  { code: "ES", name: "Espagne",   color: "#ef4444", market: "Amazon.es", tagline: "Avantages TVA européenne",  zoom: 3.0 },
]


export default function EuroMap() {
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const sectionRef  = useRef<HTMLElement>(null)
  const hintRef     = useRef<HTMLDivElement>(null)
  const svgRef      = useRef<SVGSVGElement>(null)
  const cameraRef   = useRef<SVGGElement>(null)
  const [geoData, setGeoData] = useState<{
    main: Record<string, { d: string; cx: number; cy: number }>
    ctx:  { id: number; d: string }[]
    caps: Record<string, { x: number; y: number }>
  } | null>(null)

  const [active, setActive]         = useState<Country | null>(null)
  const [progPct, setProgPct]       = useState(0)
  const [marketText, setMarketText] = useState("")
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Load geography ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/data/world-110m.json")
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((topo: Topology) => {
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
    }).catch(() => {
      // Map fails to load — section will remain empty rather than broken
    })
  }, [])


  // ── Typewriter on marketplace name ────────────────────────────────────────
  const startType = (text: string) => {
    if (typeTimerRef.current) clearInterval(typeTimerRef.current)
    setMarketText("")
    let i = 0
    typeTimerRef.current = setInterval(() => {
      if (i >= text.length) { clearInterval(typeTimerRef.current!); return }
      setMarketText(text.slice(0, ++i))
    }, 42)
  }

  // ── GSAP scroll animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (!geoData) return
    const section = sectionRef.current, wrapper = wrapperRef.current
    const hint = hintRef.current, svg = svgRef.current, cam = cameraRef.current
    if (!section || !wrapper || !svg || !cam) return
    let disposed = false
    const reduced = false

    const q = <T extends SVGElement>(sel: string) => svg.querySelector<T>(sel)
    const getPath = (code: string) => q<SVGPathElement>(`#em-path-${code}`)
    const getScan = (code: string) => q<SVGPathElement>(`#em-scan-${code}`)
    const getGrad = (code: string) => svg.querySelector<SVGLinearGradientElement>(`#scan-grad-${code}`)

    // ── Capital ring pulse — repeating GSAP loop, staggered per ring ───────
    if (!reduced) COUNTRIES.forEach((c, ci) => {
      ;[0, 1, 2].forEach(ring => {
        const el = q<SVGCircleElement>(`#em-cap-ring-${c.code}-${ring}`)
        if (!el) return
        gsap.fromTo(el,
          { attr: { r: 2.5 }, opacity: 0.85 },
          { attr: { r: 20 }, opacity: 0,
            duration: 2.2, delay: ring * 0.74 + ci * 0.28,
            ease: "power2.out", repeat: -1, repeatDelay: 0.05 })
      })
    })

    // ── Entry animation ───────────────────────────────────────────────────
    if (!reduced) {
      const ctxEls = Array.from(svg.querySelectorAll<SVGPathElement>(".em-ctx"))
      gsap.set(ctxEls, { opacity: 0, scale: 0.96, transformOrigin: "center center" })
      gsap.to(ctxEls, { opacity: 1, scale: 1, duration: 0.9, stagger: 0.025, ease: "power2.out", delay: 0.15 })
      COUNTRIES.forEach((c, i) => {
        const el = getPath(c.code); if (!el) return
        gsap.set(el, { opacity: 0 })
        gsap.to(el, { opacity: 1, duration: 0.8, delay: 0.5 + i * 0.12, ease: "power2.out" })
      })
    }
    gsap.set(cam, { scale: 1 })

    // ── Scroll timeline ───────────────────────────────────────────────────
    const seq = gsap.timeline({ paused: true })
    const [FR, DE] = COUNTRIES

    const spotlight = (code: string | null, at: number) => {
      COUNTRIES.forEach(c => {
        const el = getPath(c.code); if (!el) return
        seq.to(el, { opacity: code && c.code !== code ? 0.32 : 1, duration: 0.10 }, at)
      })
      const ctxLayer = q<SVGGElement>("#ctx-layer")
      if (ctxLayer) seq.to(ctxLayer, { opacity: code ? 0.5 : 1, duration: 0.10 }, at)
    }

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

    gsap.set(cam, { x: 0, y: 0, scale: 1 })

    const ball  = q<SVGCircleElement>("#em-beam-head")
    const trail = q<SVGPathElement>("#em-beam-trail")
    const halo  = q<SVGCircleElement>("#em-beam-halo")
    if (!ball) return

    COUNTRIES.forEach(c => {
      const el = getPath(c.code); if (!el) return
      gsap.set(el, {
        attr: { fill: `${c.color}12`, stroke: `${c.color}55`, strokeWidth: 0.9 },
        filter: `drop-shadow(0 0 10px ${c.color}30)`,
      })
    })

    const travel = (fromCode: string, toCode: string, at: number, dur: number) => {
      const a = geoData.caps[fromCode], b = geoData.caps[toCode]
      const toC = COUNTRIES.find(c => c.code === toCode)!
      if (!a || !b) return

      const mx = (a.x + b.x) / 2
      const my = Math.min(a.y, b.y) - Math.abs(b.x - a.x) * 0.09
      const pathD  = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`
      const pathLen = Math.hypot(b.x - a.x, b.y - a.y) * 1.09

      if (trail) {
        seq.set(trail, {
          attr: { d: pathD, strokeDasharray: `${pathLen * 0.18} ${pathLen}`, strokeDashoffset: pathLen },
          stroke: toC.color, opacity: 0.80,
        }, at)
        seq.to(trail, { attr: { strokeDashoffset: 0 }, opacity: 0.45, duration: dur, ease: "none" }, at)
        seq.to(trail, { opacity: 0, duration: 0.08 }, at + dur + 0.02)
      }

      const ax = a.x, ay = a.y, bx = b.x, by = b.y
      const proxy = { t: 0 }

      seq.set(ball, { fill: toC.color, opacity: 1, attr: { r: 5, cx: ax, cy: ay } }, at)
      if (halo) {
        seq.set(halo, { attr: { cx: ax, cy: ay }, fill: toC.color, opacity: 0 }, at)
        seq.to(halo, { opacity: 0.28, duration: 0.10 }, at + 0.02)
      }

      seq.fromTo(proxy, { t: 0 }, {
        t: 1, duration: dur, ease: "power2.inOut",
        onUpdate() {
          const t  = proxy.t
          const px = (1-t)*(1-t)*ax + 2*(1-t)*t*mx + t*t*bx
          const py = (1-t)*(1-t)*ay + 2*(1-t)*t*my + t*t*by
          ball.setAttribute("cx", px.toFixed(2))
          ball.setAttribute("cy", py.toFixed(2))
          halo?.setAttribute("cx", px.toFixed(2))
          halo?.setAttribute("cy", py.toFixed(2))
        },
      }, at)

      if (halo) seq.to(halo, { opacity: 0, duration: 0.08 }, at + dur - 0.05)

      scanIn(toCode, at + dur * 0.88)
      spotlight(toCode, at + dur * 0.90)
    }

    const deactivate = (code: string, at: number) => {
      const c = COUNTRIES.find(x => x.code === code)!
      const el = getPath(code); if (!el) return
      seq.to(el, {
        attr: { fill: `${c.color}12`, stroke: `${c.color}44`, strokeWidth: 0.9 },
        filter: `drop-shadow(0 0 10px ${c.color}25)`,
        duration: 0.09,
      }, at)
      spotlight(null, at)
    }

    // ── Timeline ──────────────────────────────────────────────────────────
    scanIn("FR", 0.04)
    spotlight("FR", 0.06)
    const frCap = geoData.caps.FR
    seq.set(ball, { attr: { cx: frCap?.x ?? W/2, cy: frCap?.y ?? H/2, r: 5 },
      fill: FR.color, opacity: 0 }, 0.04)
    seq.to(ball, { opacity: 1, duration: 0.08, ease: "power2.out" }, 0.06)

    deactivate("FR", 0.12)
    travel("FR", "DE", 0.14, 0.22)

    deactivate("DE", 0.56)
    travel("DE", "ES", 0.58, 0.20)

    seq.to(ball, { opacity: 0, duration: 0.06 }, 0.93)
    if (halo) seq.to(halo, { opacity: 0, duration: 0.06 }, 0.93)
    seq.duration(1)

    // ── Mobile: auto-play ─────────────────────────────────────────────────
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
      if      (p > 0.04 && p < 0.14) { act = FR;                   hold = p > 0.07 && p < 0.12 }
      else if (p > 0.14 && p < 0.36) { act = FR }
      else if (p > 0.36 && p < 0.57) { act = DE;                   hold = p > 0.40 && p < 0.55 }
      else if (p > 0.57 && p < 0.78) { act = DE }
      else if (p > 0.78 && p < 0.93) { act = COUNTRIES[2];         hold = p > 0.82 && p < 0.91 }
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

    const computeP = (s: number) => {
      // Re-read offsetTop each call — layout shifts (font load, images) would make a cached value stale
      const top = wrapper.getBoundingClientRect().top + window.scrollY
      return Math.max(0, Math.min(1, (s - top) / SCROLL_RANGE))
    }

    let driftId = 0
    if (!reduced) {
      const driftLoop = () => {
        if (!disposed && svgRef.current) {
          if (holdActive) {
            const dy = Math.sin(performance.now() * 0.001 * 0.6 * Math.PI * 2) * 0.5
            svgRef.current.style.transform = `translateY(${dy.toFixed(3)}px)`
          } else if (svgRef.current.style.transform) {
            svgRef.current.style.transform = ""
          }
        }
        driftId = requestAnimationFrame(driftLoop)
      }
      driftId = requestAnimationFrame(driftLoop)
    }

    const onScroll = () => { lerp.target = computeP(window.scrollY) }
    window.addEventListener("scroll", onScroll, { passive: true })
    // Set initial position after layout settles
    requestAnimationFrame(() => { lerp.target = computeP(window.scrollY) })

    return () => {
      disposed = true; seq.kill()
      cancelAnimationFrame(rafId); cancelAnimationFrame(driftId)
      window.removeEventListener("scroll", onScroll)
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
            {/* Deep-space background */}
            <radialGradient id="em-space" cx="50%" cy="50%" r="70%">
              <stop offset="0%"   stopColor="#050d1a" />
              <stop offset="55%"  stopColor="#020610" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            {/* Nebula gradient blobs */}
            <radialGradient id="em-neb-a" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#1e3a5f" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#050d1a" stopOpacity="0"   />
            </radialGradient>
            <radialGradient id="em-neb-b" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#2d1b4e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#050d1a" stopOpacity="0"   />
            </radialGradient>
            <radialGradient id="em-neb-c" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#0d2e1a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#050d1a" stopOpacity="0"   />
            </radialGradient>

            {/* Edge vignette */}
            <radialGradient id="em-vignette" cx="50%" cy="50%" r="75%">
              <stop offset="40%"  stopColor="transparent"                />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
            </radialGradient>

            {/* Per-country scan gradients */}
            {COUNTRIES.map(c => (
              <linearGradient key={c.code} id={`scan-grad-${c.code}`}
                x1="-960" y1="0" x2="-480" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor={c.color} stopOpacity="0"    />
                <stop offset="40%"  stopColor={c.color} stopOpacity="0.55" />
                <stop offset="60%"  stopColor={c.color} stopOpacity="0.55" />
                <stop offset="100%" stopColor={c.color} stopOpacity="0"    />
              </linearGradient>
            ))}

            {/* Beam trail */}
            <linearGradient id="em-trail-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0"    />
              <stop offset="75%"  stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1"    />
            </linearGradient>

            {/* Glow filters */}
            <filter id="em-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="em-glow-soft" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Bloom: screen-blend for cinematic glow on ball */}
            <filter id="em-bloom" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feBlend in="SourceGraphic" in2="blur" mode="screen" result="blended" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blended" />
              </feMerge>
            </filter>

            {/* Soft radial glow for colored capital dots */}
            <filter id="em-ball-glow" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Large diffuse halo around travelling ball */}
            <filter id="em-halo" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          {/* Deep-space background */}
          <rect width={W} height={H} fill="url(#em-space)" />

          {/* Camera group — everything that can pan-zoom */}
          <g ref={cameraRef} id="camera">
            <g id="ctx-layer">
              {geoData?.ctx.map(c => (
                <path key={c.id} d={c.d} className="em-ctx"
                  fill="rgba(255,255,255,0.025)"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.55" strokeLinejoin="round" />
              ))}
            </g>

            {/* Dashed connection lines between capitals */}
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

            {/* Scan overlay — animated gradient sweep */}
            {COUNTRIES.map(c => (
              <path key={`scan-${c.code}`} id={`em-scan-${c.code}`}
                d={geoData?.main[c.code]?.d ?? ""}
                fill={`url(#scan-grad-${c.code})`}
                opacity="0" pointerEvents="none" />
            ))}

            {/* Capital markers — 3 expanding rings + colored center dot */}
            {geoData && COUNTRIES.map(c => {
              const p = geoData.caps[c.code]; if (!p) return null
              return (
                <g key={`cap-${c.code}`}>
                  {([0, 1, 2] as const).map(ring => (
                    <circle key={ring}
                      id={`em-cap-ring-${c.code}-${ring}`}
                      cx={p.x} cy={p.y} r="2.5"
                      fill="none"
                      stroke={c.color}
                      strokeWidth="0.8"
                      opacity="0"
                    />
                  ))}
                  <circle cx={p.x} cy={p.y} r="2.8"
                    fill={c.color} opacity="0.95"
                    filter="url(#em-ball-glow)" />
                </g>
              )
            })}

            {/* Diffuse halo following ball during travel */}
            <circle id="em-beam-halo" cx="0" cy="0" r="34"
              fill="white" opacity="0" filter="url(#em-halo)" />

            {/* Beam trail */}
            <path id="em-beam-trail" d="" fill="none"
              stroke="url(#em-trail-grad)" strokeWidth="2.4" strokeLinecap="round"
              opacity="0" filter="url(#em-glow-soft)" />

            {/* Beam head — bloom-lit */}
            <circle id="em-beam-head" cx="0" cy="0" r="3"
              fill="#fff" opacity="0" filter="url(#em-bloom)" />
          </g>

          {/* Edge vignette */}
          <rect width={W} height={H} fill="url(#em-vignette)" pointerEvents="none" />

          {/* White transition flash */}
          <rect id="em-flash" width={W} height={H} fill="#ffffff" opacity="0" pointerEvents="none" />
        </svg>

        {/* Vertical progress rail */}
        <div className="em-progress" style={{ '--prog-color': activeColor } as React.CSSProperties}>
          <div className="em-progress__fill"
               style={{ height: `${progPct}%`, background: activeColor === "rgba(255,255,255,0.9)"
                 ? "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.5))"
                 : `linear-gradient(to bottom, ${activeColor}, ${activeColor}88)` }} />
          {COUNTRIES.map(c => {
            const isActive = active?.code === c.code
            const isPassed = progPct / 100 >= RAIL_POS[c.code]
            return (
              <div key={c.code}
                   className={`em-progress__node ${isActive ? "is-active" : ""} ${isPassed && !isActive ? "is-passed" : ""}`}
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
