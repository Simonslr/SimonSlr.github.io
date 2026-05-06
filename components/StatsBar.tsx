"use client"

import { useState, useEffect, useRef } from "react"

function CountUp({ run, to, prefix = "", suffix = "" }: { run: boolean; to: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    const start = performance.now()
    const dur = 1400
    let raf: number
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(eased * to)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <span>{prefix}{Math.round(v)}{suffix}</span>
}

const STATS = [
  { num: 30, prefix: "jusqu'à ", suffix: "%", label: "d'économie possible", static: null },
  { num: 3,  prefix: "",         suffix: "",  label: "France · Allemagne · Espagne", static: null },
  { num: 100, prefix: "",        suffix: "%", label: "Vendeurs officiels", static: null },
  { num: 0,  prefix: "",         suffix: "€", label: "Sans inscription", static: "Gratuit" },
]

export default function StatsBar() {
  const ref = useRef<HTMLElement>(null)
  const [run, setRun] = useState(false)
  const [parVal, setParVal] = useState(0)

  // Intersection — trigger count-up
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setRun(true)),
      { threshold: 0.4 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // Scroll parallax for background orbs
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return
      const r = ref.current.getBoundingClientRect()
      const p = 1 - (r.top + r.height / 2) / window.innerHeight
      setParVal(Math.max(-0.5, Math.min(1.5, p)))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section ref={ref} className="text-white relative overflow-hidden" style={{ background: "#4F46E5", padding: "48px 56px" }}>
      {/* Parallax orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: -100, right: -50, width: 320, height: 320,
          background: "radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 65%)",
          transform: `translate(${parVal * 80}px, ${parVal * -40}px)`,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: -150, left: -50, width: 380, height: 380,
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)",
          transform: `translate(${parVal * -60}px, ${parVal * 30}px)`,
        }}
      />

      <div
        className="max-w-screen-xl mx-auto grid gap-8 relative"
        style={{ gridTemplateColumns: "repeat(4,1fr)" }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            className={i > 0 ? "pl-6 border-l border-white/20" : ""}
            style={{
              opacity: run ? 1 : 0,
              transform: run ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 700ms ease ${i * 100}ms, transform 700ms cubic-bezier(0.2,0.7,0.2,1) ${i * 100}ms`,
            }}
          >
            <div className="font-black text-white" style={{ fontSize: 52, letterSpacing: "-0.04em", lineHeight: 1 }}>
              {s.static ? s.static : <CountUp run={run} to={s.num} prefix={s.prefix} suffix={s.suffix} />}
            </div>
            <div className="mt-2.5 text-sm text-white/75">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
