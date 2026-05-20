"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CustomEase } from "gsap/CustomEase"
import { getCatalogueProducts, type DesignProduct } from "@/lib/design-data"


gsap.registerPlugin(ScrollTrigger, CustomEase)

// ── Easing curves — all explicit, no built-in names ─────────────────────────
export const EASE = {
  outEditorial: CustomEase.create("outEditorial", "M0,0 C0.22,1 0.36,1 1,1"),
  outCine:      CustomEase.create("outCine",      "M0,0 C0.16,1 0.30,1 1,1"),
  inOutCine:    CustomEase.create("inOutCine",    "M0,0 C0.65,0 0.35,1 1,1"),
} as const

// ── Timings — pinned, edit here only ────────────────────────────────────────
export const TIMING = {
  introTextDur:      1.10,
  introLineStagger:  0.12,
  introSubDelay:     0.55,
  introSubDur:       0.90,
  introCTADelay:     0.85,
  introCTADur:       0.80,
  introCTAStagger:   0.08,
  railScrub:         1.4,
  railEnd:           "+=160%",
  pullbackScale:     0.965,
  pullbackOpacity:   0.55,
} as const

function formatEUR(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) + " €" : n.toFixed(2) + " €"
}

function ProductCard({ p }: { p: DesignProduct }) {
  const bestPrice   = p.prices[p.bestCountry]
  const priceValues = Object.values(p.prices)
  const worstPrice  = Math.max(...priceValues)

  return (
    <article className="hsc-card" data-best={p.bestCountry}>
      {p.savings > 0 && (
        <span className="hsc-card__savings">−{formatEUR(p.savings)}</span>
      )}
      <div className="hsc-card__media">
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.title} loading="lazy" />
        )}
      </div>
      <span className="hsc-card__brand">{p.brand}</span>
      <div className="hsc-card__name">{p.title}</div>
      <div className="hsc-card__price-row">
        <span className="hsc-card__price">{formatEUR(bestPrice)}</span>
        {worstPrice > bestPrice && (
          <span className="hsc-card__was">{formatEUR(worstPrice)}</span>
        )}
      </div>
      <Link href={`/produit/${p.slug}`} className="hsc-card__cta">
        Voir l&apos;offre
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
        </svg>
      </Link>
    </article>
  )
}

export default function HeroScrollCards() {
  const rootRef    = useRef<HTMLElement>(null)
  const railRef    = useRef<HTMLDivElement>(null)
  const pinRef     = useRef<HTMLDivElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)
  const barFillRef = useRef<HTMLSpanElement>(null)

  const products      = getCatalogueProducts().slice(0, 7)
  const maxSavingsPct = products.length > 0 ? Math.round(products[0].savingsPct) : 0
  const productCount  = products.length * 4 // approximation catalogue

  useEffect(() => {
    const root  = rootRef.current
    const rail  = railRef.current
    const pin   = pinRef.current
    const inner = innerRef.current
    const fill  = barFillRef.current
    if (!root || !rail || !pin || !inner || !fill) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isMobile = window.matchMedia("(max-width: 900px)").matches

    const ctx = gsap.context(() => {
      // ── 1. Headline line-clip reveal ────────────────────────────────────
      const lines = inner.querySelectorAll<HTMLSpanElement>(".rl > span")
      const sub   = inner.querySelector<HTMLElement>("[data-hero-sub]")
      const ctas  = inner.querySelectorAll<HTMLElement>("[data-hero-cta] > *")

      // Intro plays on load — no scroll trigger needed since hero is always visible
      gsap.set(lines, { yPercent: 110, clipPath: "inset(0 0 100% 0)" })
      if (sub) gsap.set(sub, { y: 14, opacity: 0 })
      gsap.set(ctas, { y: 16, opacity: 0 })

      const intro = gsap.timeline({
        defaults: { ease: EASE.outEditorial },
        delay: 0.45, // let page settle after Lenis + GSAP pin setup
      })

      intro
        .to(lines, {
          yPercent: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: TIMING.introTextDur,
          stagger: TIMING.introLineStagger,
        })
        .to(sub, { y: 0, opacity: 1, duration: TIMING.introSubDur, ease: EASE.outCine }, TIMING.introSubDelay)
        .to(ctas, { y: 0, opacity: 1, duration: TIMING.introCTADur, stagger: TIMING.introCTAStagger, ease: EASE.outCine }, TIMING.introCTADelay)

      // ── 2. Horizontal rail scrub ─────────────────────────────────────────
      if (!isMobile && !reduced) {
        const getDistance = () => {
          const railW = rail.scrollWidth
          const viewW = rail.parentElement!.getBoundingClientRect().width
          return Math.max(0, railW - viewW + 60)
        }

        gsap.to(rail, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: TIMING.railEnd,
            pin: true,
            pinSpacing: true,
            scrub: TIMING.railScrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              if (fill) fill.style.width = (st.progress * 100).toFixed(1) + "%"
            },
          },
        })

        // Camera pullback — hero dims and scales as next section rises
        gsap.to(inner, {
          scale:   TIMING.pullbackScale,
          opacity: TIMING.pullbackOpacity,
          ease:    EASE.inOutCine,
          scrollTrigger: {
            trigger:  pin,
            start:    "top+=70% top",
            end:      TIMING.railEnd,
            scrub:    1,
            invalidateOnRefresh: true,
          },
        })

        const onResize = () => ScrollTrigger.refresh()
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
      } else {
        // Mobile: native horizontal scroll
        if (rail.parentElement) {
          rail.parentElement.classList.add("is-native-scroll")
          rail.style.transform = "none"
        }
      }
    }, root)

    return () => ctx.revert()
  }, [products.length])

  return (
    <section ref={rootRef} className="hero-scroll" id="top" data-hero="dark">
      <div ref={pinRef} className="hero-scroll__pin">
        <div className="hero__bg" aria-hidden="true" />

        <div ref={innerRef} className="hero-scroll__inner">
          {/* Gauche — titre éditorial */}
          <div className="hero-scroll__left">
            <h1 className="hero-title">
              <span className="rl"><span>Le même produit.</span></span>
              <span className="rl"><span><i className="italic">Moins cher</i> ailleurs.</span></span>
              <span className="rl"><span>En <span style={{ color: "var(--blue)" }}>Europe.</span></span></span>
            </h1>

            <p className="hero-sub" data-hero-sub>
              EuroCompare scanne Amazon France, Allemagne et Espagne en continu.
              Livraison incluse, vendeurs officiels, sans inscription.
            </p>

            <div className="hero-scroll__ctas" data-hero-cta>
              <a className="btn btn--primary" href="#catalogue">
                Voir les économies
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
              <a className="btn btn--ghost" href="#methode">Comment ça marche</a>
            </div>

            <div className="hero-stats">
              <div>
                <div className="stat__num"><span className="em">{maxSavingsPct}&nbsp;%</span></div>
                <div className="stat__lab">d&apos;écart max</div>
              </div>
              <div>
                <div className="stat__num">{productCount}+</div>
                <div className="stat__lab">produits</div>
              </div>
              <div>
                <div className="stat__num">
                  <span className="em">3</span>
                  <span style={{ opacity: 0.4 }}>/3</span>
                </div>
                <div className="stat__lab">marketplaces</div>
              </div>
            </div>
          </div>

          {/* Droite — rail produits */}
          <div className="hero-scroll__rail-wrap">
            <div ref={railRef} className="hero-scroll__rail">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="hsc-progress" aria-hidden="true">
          <div className="hsc-progress__bar">
            <span ref={barFillRef} style={{ display: "block", height: "100%", width: "0%", background: "rgba(255,255,255,0.55)", transition: "width 60ms linear" }} />
          </div>
        </div>
      </div>
    </section>
  )
}
