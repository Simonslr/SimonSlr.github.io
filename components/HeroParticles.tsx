"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number; y: number
  vx: number; vy: number
  opacity: number; opDir: number
  r: number
}

const MAX_DIST = 110
const COUNT    = 42

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let disposed = false
    let rafId = 0
    let W = 0, H = 0
    let particles: Particle[] = []
    let initialized = false

    const reduced = false
    const MAX_DIST2 = MAX_DIST * MAX_DIST

    const draw = () => {
      if (disposed) return
      if (W > 0 && H > 0 && initialized) {
        ctx.clearRect(0, 0, W, H)

        for (const p of particles) {
          p.x += p.vx; p.y += p.vy
          if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0
          if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0
          p.opacity += p.opDir * 0.0012
          if (p.opacity > 0.82) { p.opacity = 0.82; p.opDir = -1 }
          if (p.opacity < 0.06) { p.opacity = 0.06; p.opDir = 1 }
        }

        // Connection lines — single batched path + one stroke() call (was O(n²) individual strokes)
        ctx.beginPath()
        ctx.lineWidth = 0.5
        for (let i = 0; i < COUNT; i++) {
          for (let j = i + 1; j < COUNT; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            if (dx * dx + dy * dy < MAX_DIST2) {
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
            }
          }
        }
        ctx.strokeStyle = "rgba(59,130,246,0.14)"
        ctx.stroke()

        // Dots — single batched path + one fill() call
        ctx.beginPath()
        for (const p of particles) {
          ctx.moveTo(p.x + p.r, p.y)
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        }
        ctx.fillStyle = "rgba(148,163,184,0.55)"
        ctx.fill()
      }
      rafId = reduced ? 0 : requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        W = entry.contentRect.width
        H = entry.contentRect.height
        canvas.width  = W
        canvas.height = H
        if (!initialized && W > 0 && H > 0) {
          initialized = true
          particles = Array.from({ length: COUNT }, () => ({
            x:      Math.random() * W,
            y:      Math.random() * H,
            vx:     (Math.random() - 0.5) * 0.24,
            vy:     (Math.random() - 0.5) * 0.18,
            opacity: 0.15 + Math.random() * 0.55,
            opDir:   Math.random() > 0.5 ? 1 : -1,
            r:       0.9 + Math.random() * 1.2,
          }))
        }
      }
    })

    ro.observe(canvas)
    rafId = requestAnimationFrame(draw)

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-particles-canvas"
      aria-hidden="true"
    />
  )
}
