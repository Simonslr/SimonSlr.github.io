"use client"

import { useEffect, useRef } from "react"
import { getCatalogueProducts } from "@/lib/design-data"

type WindowWithSplash = Window & typeof globalThis & { __introSplashDone?: boolean }

export default function HeroText() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const lines = root.querySelectorAll<HTMLElement>("[data-reveal-line]")

    let inView = false
    let splashDone = false
    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      lines.forEach((el, i) => {
        el.style.transitionDelay = `${i * 90}ms`
        el.classList.add("is-revealed")
      })
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          inView = true
          if (splashDone) reveal()
          io.disconnect()
        }
      })
    }, { threshold: 0.2 })
    io.observe(root)

    // Wait for the intro splash to finish (or skip) before revealing, so the
    // reveal animation isn't wasted while hidden behind the splash overlay.
    // Fallback after 2200ms in case introsplash:done never fires.
    let started = false
    const onSplashDone = () => {
      if (started) return
      started = true
      splashDone = true
      if (inView) reveal()
    }
    if ((window as WindowWithSplash).__introSplashDone) {
      onSplashDone()
    } else {
      window.addEventListener("introsplash:done", onSplashDone, { once: true })
    }
    const fallback = setTimeout(onSplashDone, 2200)

    return () => {
      io.disconnect()
      window.removeEventListener("introsplash:done", onSplashDone)
      clearTimeout(fallback)
    }
  }, [])

  const products = getCatalogueProducts()
  const maxPct = products.length > 0 ? Math.round(products[0].savingsPct) : 0

  return (
    <section ref={rootRef} id="top" className="hero-text" data-hero="dark">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero-text__inner wrap">
        <h1 className="hero-title">
          <span className="hero-text__line" data-reveal-line>Le même produit.</span>
          <span className="hero-text__line" data-reveal-line>
            <span className="italic">Moins cher ailleurs.</span>
          </span>
          <span className="hero-text__line" data-reveal-line>
            En <span style={{ color: "var(--blue)" }}>Europe.</span>
          </span>
        </h1>

        <p className="hero-sub hero-text__sub" data-reveal-line>
          ComparEuro est le comparateur de prix Amazon qui vous fait économiser :
          on scanne la France, l&apos;Allemagne et l&apos;Espagne pour trouver le prix
          le plus bas. Livraison incluse, vendeurs officiels, sans inscription.
        </p>

        <div className="hero-text__ctas" data-reveal-line>
          <a className="btn btn--primary" href="#catalogue">
            Voir les économies
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 200ms cubic-bezier(0.32,0.72,0,1)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </a>
          <a className="btn btn--ghost" href="#methode">Comment ça marche</a>
        </div>

        <div className="hero__stats hero-text__stats" data-reveal-line>
          <div>
            <div className="stat__num"><span className="em">{maxPct}&nbsp;%</span></div>
            <div className="stat__lab">d&apos;écart max</div>
          </div>
          <div>
            <div className="stat__num">{products.length}+</div>
            <div className="stat__lab">produits</div>
          </div>
          <div>
            <div className="stat__num"><span className="em">3</span><span style={{ opacity: 0.4 }}>/3</span></div>
            <div className="stat__lab">marketplaces</div>
          </div>
        </div>
      </div>
    </section>
  )
}
