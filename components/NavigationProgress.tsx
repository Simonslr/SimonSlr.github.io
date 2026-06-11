"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function NavigationProgress() {
  const pathname  = usePathname()
  const barRef    = useRef<HTMLDivElement>(null)
  const prevPath  = useRef(pathname)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (pathname === prevPath.current) return
    prevPath.current = pathname
    const bar = barRef.current
    if (!bar) return

    // Route changed — complete and hide
    document.documentElement.style.cursor = ""
    bar.style.transition = "width 150ms ease, opacity 300ms ease 150ms"
    bar.style.width   = "100%"
    bar.style.opacity = "1"
    timerRef.current = setTimeout(() => {
      if (!barRef.current) return
      barRef.current.style.opacity = "0"
      barRef.current.style.width   = "0%"
      barRef.current.style.transition = "none"
    }, 450)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [pathname])

  // On click of any internal link, start the bar
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute("href") ?? ""
      if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) return

      // Same-page hash links (e.g. "/#catalogue" while already on "/") trigger
      // a same-document scroll, not a route change — usePathname() never
      // updates, so the bar/cursor would otherwise get stuck forever.
      const hashIndex = href.indexOf("#")
      const path = hashIndex === -1 ? href : href.slice(0, hashIndex)
      if ((path || "/") === pathname) return

      bar.style.transition = "none"
      bar.style.width      = "8%"
      bar.style.opacity    = "1"
      document.documentElement.style.cursor = "progress"
      requestAnimationFrame(() => {
        bar.style.transition = "width 2.5s cubic-bezier(0.05,0.05,0,1)"
        bar.style.width      = "85%"
      })
    }

    window.addEventListener("click", onClick)
    return () => window.removeEventListener("click", onClick)
  }, [pathname])

  return (
    <div
      ref={barRef}
      style={{
        position:        "fixed",
        top:             0,
        left:            0,
        height:          3,
        width:           "0%",
        opacity:         0,
        background:      "linear-gradient(90deg, #3b82f6, #60a5fa)",
        zIndex:          9999,
        pointerEvents:   "none",
        boxShadow:       "0 0 8px #3b82f688",
        borderRadius:    "0 2px 2px 0",
      }}
    />
  )
}
