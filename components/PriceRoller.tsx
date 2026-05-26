"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

// Split-flap digit ticker. Non-digit characters (€, comma, space) are static.
// Each digit rolls from 0 to its final value like an airport departure board.
interface Props {
  value: string
  className?: string
}

export default function PriceRoller({ value, className }: Props) {
  const rootRef   = useRef<HTMLSpanElement>(null)
  const cellsRef  = useRef<Array<HTMLSpanElement | null>>([])
  // Ref (not state) so setting it doesn't trigger a re-render / cleanup race
  const playedRef = useRef(false)

  const chars = Array.from(value)

  useEffect(() => {
    const root = rootRef.current
    if (!root || playedRef.current) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let killed = false

    const io = new IntersectionObserver((entries) => {
      if (!entries.find((e) => e.isIntersecting) || killed) return
      io.disconnect()
      playedRef.current = true  // prevent re-registration before any re-render

      chars.forEach((ch, i) => {
        const cell = cellsRef.current[i]
        if (!cell) return
        const isDigit = ch.charCodeAt(0) >= 48 && ch.charCodeAt(0) <= 57
        if (!isDigit) return

        const target = parseInt(ch, 10)
        const reel   = cell.querySelector<HTMLElement>(".pr__reel")
        if (!reel) return

        // Each .pr__d is 1em; the reel is 10em tall.
        // yPercent is % of reel height → each digit step = 10%.
        const finalY = -target * 10

        if (reducedMotion) {
          gsap.set(reel, { yPercent: finalY })
          return
        }

        const rotations = 1 + Math.floor(Math.random() * 2)
        gsap.set(reel, { yPercent: 0 })
        gsap.to(reel, {
          // Overshoot by rotations full cycles (each = 100% of reel = 10 digits),
          // then snap back to the exact digit in onComplete.
          yPercent:  finalY - rotations * 100,
          duration:  1.2 + i * 0.06,
          delay:     i * 0.05,
          ease:      "expo.out",
          onComplete: () => { gsap.set(reel, { yPercent: finalY }) },
        })
      })
    }, { threshold: 0.2 })

    io.observe(root)
    return () => { killed = true; io.disconnect() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally empty — value is static per mount; ref captures current chars

  return (
    <span ref={rootRef} className={`pr ${className ?? ""}`.trim()} aria-label={value}>
      {chars.map((ch, i) => {
        const isDigit = ch.charCodeAt(0) >= 48 && ch.charCodeAt(0) <= 57
        if (!isDigit) return <span key={i} className="pr__static">{ch}</span>
        return (
          <span key={i} className="pr__cell"
            ref={(el) => { cellsRef.current[i] = el }}
            aria-hidden="true">
            <span className="pr__reel">
              {Array.from({ length: 10 }, (_, n) => <span key={n} className="pr__d">{n}</span>)}
            </span>
          </span>
        )
      })}
    </span>
  )
}
