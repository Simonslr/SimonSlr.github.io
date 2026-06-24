"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import CompareUroLogo from "./CompareUroLogo"

const SECTION_IDS = ["methode", "vedette", "catalogue", "confiance"]

export default function DesignNavbar() {
  const pathname = usePathname()
  const [scrolled,   setScrolled]   = useState(false)
  const [isDark,     setIsDark]     = useState(pathname === "/")
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [menuRendered, setMenuRendered] = useState(false)
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 })

  const linksRef    = useRef<HTMLDivElement>(null)
  const hoveringRef = useRef(false)

  // Slides the active-link indicator under the given nav link (by href).
  // Pass null to hide it (e.g. while above the first tracked section).
  const movePill = (href: string | null) => {
    const container = linksRef.current
    if (!container || !href) {
      setPill((p) => (p.opacity === 0 ? p : { ...p, opacity: 0 }))
      return
    }
    const link = container.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)
    if (!link) {
      setPill((p) => (p.opacity === 0 ? p : { ...p, opacity: 0 }))
      return
    }
    const cRect = container.getBoundingClientRect()
    const lRect = link.getBoundingClientRect()
    setPill({ left: lRect.left - cRect.left, width: lRect.width, opacity: 1 })
  }

  useEffect(() => {
    // Catches any element with data-hero="dark" (HeroText, EuroMap, HeroGlobe…)
    // plus legacy section classes. No class restriction on the attribute selector.
    const DARK = "[data-hero='dark'], .hero-scroll, .globe-hero-section, .method, .featured, .trust, .cta-fin"

    const update = () => {
      const y = window.scrollY
      setScrolled(y > 8)

      const navH    = 64
      const sections = Array.from(document.querySelectorAll<HTMLElement>(DARK))
      const hit      = sections.find((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= navH && r.bottom > 0
      })
      setIsDark(!!hit)

      // Highlight the nav link for whichever tracked section currently
      // sits at/above ~35% of the viewport (last one reached wins).
      const refLine = navH + window.innerHeight * 0.35
      let active: string | null = null
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= refLine) active = `/#${id}`
        else break
      }
      setActiveHref(active)
      if (!hoveringRef.current) movePill(active)
    }

    // Immediate call so the navbar is correct on first paint (no scroll needed)
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    // Recompute once webfonts swap in, since that can shift link widths.
    if ("fonts" in document) {
      (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready.then(update)
    }
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  // Fermer le menu au scroll
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener("scroll", close, { once: true, passive: true })
    return () => window.removeEventListener("scroll", close)
  }, [menuOpen])

  // Garde le menu monté le temps de la transition CSS de sortie
  useEffect(() => {
    if (menuOpen) { setMenuRendered(true); return }
    if (!menuRendered) return
    const t = setTimeout(() => setMenuRendered(false), 400)
    return () => clearTimeout(t)
  }, [menuOpen, menuRendered])

  const handleCompare = () => {
    setMenuOpen(false)
    if (document.getElementById("comparateur")) {
      document.getElementById("comparateur")!.scrollIntoView({ behavior: "smooth" })
    } else {
      window.location.href = "/#comparateur"
    }
  }

  const navLinks = [
    { href: "/#methode",    label: "Comment ça marche" },
    { href: "/#vedette",    label: "Sélection" },
    { href: "/#catalogue",  label: "Catalogue" },
    { href: "/#confiance",  label: "Confiance" },
  ]

  return (
    <>
      <nav id="site-nav" className={`nav${isDark ? " is-dark" : ""}${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap nav__inner">
          {/* Logo — vrai logo ComparEuro */}
          <Link className="nav__logo" href="/" style={{ gap: 8 }}>
            <CompareUroLogo size={24} color="currentColor" textColor="currentColor" showText={false} />
            <span>ComparEuro</span>
          </Link>

          {/* Desktop links */}
          <div
            className="nav__links"
            ref={linksRef}
            onMouseLeave={() => { hoveringRef.current = false; movePill(activeHref) }}
          >
            <span
              className="nav__pill"
              aria-hidden="true"
              style={{ transform: `translateX(${pill.left}px)`, width: `${pill.width}px`, opacity: pill.opacity }}
            />
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={activeHref === l.href ? "is-active" : undefined}
                onMouseEnter={() => { hoveringRef.current = true; movePill(l.href) }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop right */}
          <div className="nav__right">
            <button className="btn btn--primary" type="button" onClick={handleCompare}>
              Comparer
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 200ms cubic-bezier(0.32,0.72,0,1)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="btn btn--ghost nav__burger"
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuRendered && (
        <div
          className={`nav__mobile${menuOpen ? " is-open" : ""}${isDark ? " is-dark" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          {navLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="nav__mobile-link"
              style={{ transitionDelay: `${50 + i * 70}ms` }}
            >
              {l.label}
            </a>
          ))}
          <div className="nav__mobile-cta" style={{ transitionDelay: `${50 + navLinks.length * 70}ms` }}>
            <button
              className="btn btn--primary"
              type="button"
              onClick={handleCompare}
              style={{ fontSize: 16, padding: "14px 32px", display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              Comparer maintenant
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}

    </>
  )
}
