"use client"

import { useEffect } from "react"

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let lenis: any

    async function init() {
      const Lenis = (await import("lenis")).default
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      })

      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      // When ScrollTrigger adds/removes pin spacers it changes page height.
      // Lenis must recalculate its scroll length each time.
      ScrollTrigger.addEventListener("refresh", () => lenis.resize())
      ScrollTrigger.refresh()

      ;(window as any).__lenis = lenis
    }

    const t = setTimeout(init, 50)
    return () => {
      clearTimeout(t)
      lenis?.destroy()
    }
  }, [])

  return null
}
