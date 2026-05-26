"use client"

import { useEffect, useRef } from "react"
import { getCatalogueProducts } from "@/lib/design-data"
export default function HeroText() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const lines = root.querySelectorAll<HTMLElement>("[data-reveal-line]")
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          lines.forEach((el, i) => {
            el.style.transitionDelay = `${i * 90}ms`
            el.classList.add("is-revealed")
          })
          io.disconnect()
        }
      })
    }, { threshold: 0.2 })
    io.observe(root)
    return () => io.disconnect()
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
          EuroCompare scanne Amazon France, Allemagne et Espagne — livraison incluse,
          vendeurs officiels, sans inscription.
        </p>

        <div className="hero-text__ctas" data-reveal-line>
          <a className="btn btn--primary" href="#catalogue">
            Voir les économies
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
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
