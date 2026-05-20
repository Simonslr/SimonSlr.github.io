"use client"

import { useEffect, useRef, useState } from "react"

// Split-flap digit ticker. Non-digit characters (€, comma, space) are static.
// Each digit rolls from a random start to its final value like an airport board.
interface Props {
  value: string
  className?: string
}

export default function PriceRoller({ value, className }: Props) {
  const rootRef  = useRef<HTMLSpanElement>(null)
  const cellsRef = useRef<Array<HTMLSpanElement | null>>([])
  const [played, setPlayed] = useState(false)

  const chars = Array.from(value)

  useEffect(() => {
    const root = rootRef.current
    if (!root || played) return

    let killed = false
    const tweens: Array<{ kill: () => void }> = []

    const io = new IntersectionObserver(async (entries) => {
      if (!entries.find((e) => e.isIntersecting) || killed) return
      io.disconnect()

      const { gsap } = await import("gsap")
      if (killed) return

      chars.forEach((ch, i) => {
        const cell = cellsRef.current[i]
        if (!cell) return
        const isDigit = ch.charCodeAt(0) >= 48 && ch.charCodeAt(0) <= 57
        if (!isDigit) return
        const target = parseInt(ch, 10)
        const reel   = cell.querySelector<HTMLElement>(".pr__reel")
        if (!reel) return
        const rotations = 1 + Math.floor(Math.random() * 2)
        gsap.set(reel, { yPercent: 0 })
        const tw = gsap.to(reel, {
          yPercent: -(target + rotations * 10) * 100,
          duration: 1.2 + i * 0.06,
          delay:    i * 0.05,
          ease: "expo.out",
          onComplete: () => { gsap.set(reel, { yPercent: -target * 100 }) },
        })
        tweens.push(tw)
      })
      setPlayed(true)
    }, { threshold: 0.6 })

    io.observe(root)
    return () => { killed = true; io.disconnect(); tweens.forEach(t => t.kill()) }
  }, [chars, played])

  return (
    <span ref={rootRef} className={`pr ${className ?? ""}`.trim()} aria-label={value}>
      {chars.map((ch, i) => {
        const isDigit = ch.charCodeAt(0) >= 48 && ch.charCodeAt(0) <= 57
        if (!isDigit) return <span key={i} className="pr__static">{ch}</span>
        return (
          <span key={i} className="pr__cell" ref={(el) => { cellsRef.current[i] = el }} aria-hidden="true">
            <span className="pr__reel">
              {Array.from({ length: 10 }, (_, n) => <span key={n} className="pr__d">{n}</span>)}
            </span>
          </span>
        )
      })}
    </span>
  )
}
