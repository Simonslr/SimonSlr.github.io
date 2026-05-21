"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import EuroCompareLogo from "./EuroCompareLogo"
import { createClient } from "@/lib/supabase/browser"

export default function DesignNavbar() {
  const pathname = usePathname()
  const [scrolled,   setScrolled]   = useState(false)
  const [isDark,     setIsDark]     = useState(pathname === "/")
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

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
          <a className="nav__logo" href="/" style={{ gap: 8 }}>
            <EuroCompareLogo size={24} color="currentColor" textColor="currentColor" showText={false} />
            <span>EuroCompare</span>
          </a>

          {/* Desktop links */}
          <div className="nav__links">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>

          {/* Desktop right */}
          <div className="nav__right">
            {isLoggedIn ? (
              <Link href="/compte" className="btn btn--ghost" style={{ fontSize: 14 }}>
                Mon compte
              </Link>
            ) : (
              <Link href="/connexion" className="btn btn--ghost" style={{ fontSize: 14 }}>
                Connexion
              </Link>
            )}
            <button className="btn btn--primary" type="button" onClick={handleCompare}>
              Comparer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
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
      {menuOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 99,
            background: isDark ? "rgba(10,15,30,0.97)" : "rgba(255,255,255,0.97)",
            backdropFilter: "blur(16px)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 8,
          }}
          onClick={() => setMenuOpen(false)}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em",
                color: isDark ? "#fff" : "#0f172a",
                textDecoration: "none", padding: "12px 24px",
                opacity: 0.9,
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            className="btn btn--primary"
            type="button"
            onClick={handleCompare}
            style={{ marginTop: 24, fontSize: 16, padding: "14px 32px" }}
          >
            Comparer maintenant
          </button>
        </div>
      )}

      <style>{`
        .nav__burger { display: none; }
        @media (max-width: 720px) {
          .nav__burger { display: inline-flex; }
        }
      `}</style>
    </>
  )
}
