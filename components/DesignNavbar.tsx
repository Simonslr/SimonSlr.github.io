"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import EuroCompareLogo from "./EuroCompareLogo"

export default function DesignNavbar() {
  const pathname = usePathname()
  const [scrolled,   setScrolled]   = useState(false)
  const [isDark,     setIsDark]     = useState(pathname === "/")
  const [menuOpen,   setMenuOpen]   = useState(false)

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
    }

    // Immediate call so the navbar is correct on first paint (no scroll needed)
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
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
          {/* Logo — vrai logo EuroCompare */}
          <Link className="nav__logo" href="/" style={{ gap: 8 }}>
            <EuroCompareLogo size={24} color="currentColor" textColor="currentColor" showText={false} />
            <span>EuroCompare</span>
          </Link>

          {/* Desktop links */}
          <div className="nav__links">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>

          {/* Desktop right */}
          <div className="nav__right">
            <button className="btn btn--primary" type="button" onClick={handleCompare}>
              Comparer
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 200ms cubic-bezier(0.32,0.72,0,1)" }}>
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
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              background: isDark ? "rgba(10,15,30,0.97)" : "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 4,
            }}
            onClick={() => setMenuOpen(false)}
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.07, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em",
                  color: isDark ? "#fff" : "#0f172a",
                  textDecoration: "none", padding: "12px 24px",
                  opacity: 0.9,
                  display: "block",
                }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + navLinks.length * 0.07, ease: [0.32, 0.72, 0, 1] }}
              style={{ marginTop: 28 }}
            >
              <button
                className="btn btn--primary"
                type="button"
                onClick={handleCompare}
                style={{ fontSize: 16, padding: "14px 32px", display: "inline-flex", alignItems: "center", gap: 10 }}
              >
                Comparer maintenant
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
