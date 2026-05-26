"use client"

import { useEffect } from "react"

type WindowWithLenis = Window & typeof globalThis & { __lenis?: unknown }

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any

    async function init() {
      const Lenis = (await import("lenis")).default
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 2,
      })

      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      ScrollTrigger.addEventListener("refresh", () => lenis.resize())
      ScrollTrigger.refresh()

      ;(window as WindowWithLenis).__lenis = lenis
      window.dispatchEvent(new CustomEvent("lenis:ready", { detail: lenis }))
    }

    const t = setTimeout(init, 50)
    return () => {
      clearTimeout(t)
      lenis?.destroy()
    }
  }, [])

  return null
}
