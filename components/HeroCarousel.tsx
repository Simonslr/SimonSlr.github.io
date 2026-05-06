"use client"

import { useState, useEffect } from "react"
import Flag from "./Flag"
import ProductIllustration from "./ProductIllustration"

const DURATION = 4500

// ── Slide 1 — Le problème ──────────────────────────────────────────────────
function SlideProblem() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "#0F172A", padding: "120px 80px 100px" }}
    >
      <div className="max-w-screen-xl w-full grid gap-20" style={{ gridTemplateColumns: "1.1fr 1fr", alignItems: "center" }}>
        <div>
          <div
            className="inline-flex items-center gap-2.5 mb-8 text-xs font-semibold tracking-widest uppercase"
            style={{
              padding: "8px 16px", borderRadius: 999,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff",
              letterSpacing: "0.18em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
            Le problème · 01 / 03
          </div>
          <h1 className="text-white font-black m-0" style={{ fontSize: 88, lineHeight: 0.98, letterSpacing: "-0.04em", textWrap: "balance" }}>
            Vous payez<br />
            <span style={{ color: "#F43F5E" }}>trop cher.</span>
          </h1>
          <p className="mt-7" style={{ fontSize: 22, color: "rgba(255,255,255,0.7)", maxWidth: 540, lineHeight: 1.5 }}>
            Les mêmes produits Amazon coûtent jusqu'à{" "}
            <strong style={{ color: "#fff" }}>30% moins cher</strong> en Allemagne ou en Espagne. Personne ne vous le dit.
          </p>
        </div>

        <div className="relative">
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <PriceCard country="FR" price="249 €" state="bad" tag="Vous achetez ici" />
            <PriceCard country="DE" price="199 €" state="good" tag="Disponible ici" />
          </div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-white text-sm font-bold"
            style={{
              padding: "10px 18px", borderRadius: 999,
              background: "#0F172A", border: "2px solid #F43F5E",
              boxShadow: "0 12px 40px -10px rgba(244,63,94,0.5)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round"><path d="m3 7 7 7 4-4 7 7"/><path d="M14 17h7v-7"/></svg>
            50 € de différence
          </div>
        </div>
      </div>

      <SlideEyebrowTag slide="01" label="Le problème" dot="#F43F5E" />
    </div>
  )
}

function PriceCard({ country, price, state, tag }: { country: string; price: string; state: "bad" | "good"; tag: string }) {
  const bad = state === "bad"
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: bad ? "rgba(244,63,94,0.08)" : "rgba(16,185,129,0.08)",
        border: `1px solid ${bad ? "rgba(244,63,94,0.4)" : "rgba(16,185,129,0.4)"}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <Flag country={country} size={22} />
        <span className="text-xs font-semibold text-white/80">{country === "FR" ? "Amazon.fr" : "Amazon.de"}</span>
      </div>
      <div className="mb-5">
        <ProductIllustration type="airpods-pro-2" size={110} dark />
      </div>
      <div className="text-xs uppercase tracking-widest font-mono text-white/50 mb-1.5">Prix livraison incluse</div>
      <div className="font-black" style={{ fontSize: 52, letterSpacing: "-0.04em", lineHeight: 1, color: bad ? "#F43F5E" : "#34D399" }}>
        {price}
      </div>
      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-white/60">
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: bad ? "#F43F5E" : "#34D399" }} />
        {tag}
      </div>
    </div>
  )
}

// ── Slide 2 — La solution ─────────────────────────────────────────────────
function SlideSolution() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)", padding: "120px 80px 100px" }}
    >
      <div className="max-w-screen-xl w-full grid gap-20" style={{ gridTemplateColumns: "1.1fr 1fr", alignItems: "center" }}>
        <div>
          <div
            className="inline-flex items-center gap-2.5 mb-8 text-xs font-semibold tracking-widest uppercase text-white"
            style={{ padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", letterSpacing: "0.18em" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
            La solution · 02 / 03
          </div>
          <h1 className="text-white font-black m-0" style={{ fontSize: 88, lineHeight: 0.98, letterSpacing: "-0.04em", textWrap: "balance" }}>
            On compare<br />pour vous.
          </h1>
          <p className="mt-7" style={{ fontSize: 22, color: "rgba(255,255,255,0.85)", maxWidth: 540, lineHeight: 1.5 }}>
            Prix total <strong className="text-white">livraison incluse</strong>.
            Vendeurs officiels uniquement. Résultat en <strong className="text-white">1 clic</strong>.
          </p>
          <div className="flex gap-2 mt-8 flex-wrap">
            {["Pas de marketplace tiers", "Données vérifiées", "100% gratuit"].map(t => (
              <div
                key={t}
                className="inline-flex items-center gap-2 text-white text-xs font-medium"
                style={{ padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m20 6-11 11-5-5"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="relative" style={{ aspectRatio: "1/0.9" }}>
          <svg viewBox="0 0 500 450" className="absolute inset-0 w-full h-full">
            <defs>
              <marker id="sol-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.85)" />
              </marker>
            </defs>
            <path d="M150,110 Q250,40 360,110" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeDasharray="6 6" fill="none" markerEnd="url(#sol-arrow)" />
            <path d="M380,150 Q420,260 290,360" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeDasharray="6 6" fill="none" markerEnd="url(#sol-arrow)" />
            <path d="M210,360 Q90,260 130,150" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeDasharray="6 6" fill="none" markerEnd="url(#sol-arrow)" />
          </svg>
          <FlagBubble country="FR" price="249 €" top="0%" left="50%" tx="-50%" />
          <FlagBubble country="DE" price="199 €" top="55%" left="100%" tx="-100%" best />
          <FlagBubble country="ES" price="219 €" top="55%" left="0%" tx="0" />
        </div>
      </div>
    </div>
  )
}

function FlagBubble({ country, price, top, left, tx, best }: { country: string; price: string; top: string; left: string; tx: string; best?: boolean }) {
  const name: Record<string, string> = { FR: "France", DE: "Allemagne", ES: "Espagne" }
  return (
    <div
      className="absolute rounded-2xl"
      style={{
        top, left, transform: `translate(${tx}, -50%)`,
        background: "rgba(255,255,255,0.12)",
        border: best ? "2px solid #fff" : "1px solid rgba(255,255,255,0.3)",
        padding: "16px 20px", minWidth: 140,
        backdropFilter: "blur(10px)",
        boxShadow: best ? "0 20px 60px -10px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <Flag country={country} size={22} />
        <span className="text-xs font-semibold text-white/90">{name[country]}</span>
      </div>
      <div className="font-black text-white" style={{ fontSize: 34, letterSpacing: "-0.03em", lineHeight: 1 }}>{price}</div>
      {best && <div className="mt-2 text-xs font-bold tracking-widest uppercase" style={{ color: "#A7F3D0" }}>✓ Meilleur prix</div>}
    </div>
  )
}

// ── Slide 3 — L'économie ──────────────────────────────────────────────────
function SlideSavings({ onCTA }: { onCTA: () => void }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg,#059669 0%,#0D9488 100%)", padding: "120px 80px 100px" }}
    >
      <div className="max-w-screen-xl w-full grid gap-20" style={{ gridTemplateColumns: "1.1fr 1fr", alignItems: "center" }}>
        <div>
          <div
            className="inline-flex items-center gap-2.5 mb-8 text-xs font-semibold tracking-widest uppercase text-white"
            style={{ padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", letterSpacing: "0.18em" }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#A7F3D0" }} />
            L'économie · 03 / 03
          </div>
          <h1 className="text-white font-black m-0" style={{ fontSize: 88, lineHeight: 0.98, letterSpacing: "-0.04em", textWrap: "balance" }}>
            Économisez<br />maintenant.
          </h1>
          <p className="mt-7" style={{ fontSize: 22, color: "rgba(255,255,255,0.9)", maxWidth: 540, lineHeight: 1.5 }}>
            Recherchez un produit et découvrez immédiatement où l'acheter au meilleur prix.
          </p>
          <div className="flex items-center gap-4 mt-9 flex-wrap">
            <button
              onClick={onCTA}
              className="inline-flex items-center gap-2.5 cursor-pointer font-bold"
              style={{
                padding: "18px 28px", borderRadius: 14,
                background: "#fff", color: "#059669",
                fontSize: 17, border: "none",
                boxShadow: "0 16px 40px -8px rgba(0,0,0,0.25)",
              }}
            >
              Comparer maintenant
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </button>
            <span className="text-sm text-white/80 font-mono tracking-wider">Gratuit · Sans inscription</span>
          </div>
        </div>

        <div
          className="rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
            padding: 28, backdropFilter: "blur(8px)", color: "#fff",
          }}
        >
          <div className="text-xs tracking-widest uppercase font-mono text-white/75 mb-4">Exemple d'économie</div>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-xs tracking-wider"
              style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
            >
              ÉCOUT.
            </div>
            <div>
              <div className="font-bold text-lg leading-snug">Écouteurs sans fil — gamme premium</div>
              <div className="text-sm text-white/70 mt-1">Vendeur officiel · livraison incluse</div>
            </div>
          </div>
          <div
            className="flex items-center justify-between gap-4 rounded-xl p-5 mb-4"
            style={{ background: "rgba(0,0,0,0.18)" }}
          >
            <div>
              <div className="text-xs text-white/70 mb-1">France</div>
              <div className="font-bold text-white/60 line-through" style={{ fontSize: 28 }}>249 €</div>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            <div className="text-right">
              <div className="text-xs text-white/90 mb-1">Allemagne</div>
              <div className="font-black" style={{ fontSize: 40, letterSpacing: "-0.03em" }}>199 €</div>
            </div>
          </div>
          <div className="rounded-xl flex items-center justify-between" style={{ padding: "14px 18px", background: "#fff", color: "#059669" }}>
            <span className="font-bold text-base">Économisez 50 €</span>
            <span className="font-mono font-semibold text-sm">−20%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Shared: scroll cue ─────────────────────────────────────────────────────
function SlideEyebrowTag({ slide, label, dot }: { slide: string; label: string; dot: string }) {
  return null // already inlined per-slide
}

// ── Main carousel ──────────────────────────────────────────────────────────
export default function HeroCarousel() {
  const [idx, setIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  const scrollToSearch = () => {
    const el = document.getElementById("search-section")
    if (el) {
      const top = window.scrollY + el.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  useEffect(() => {
    setProgress(0)
    const start = performance.now()
    let raf: number
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION)
      setProgress(p)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setIdx(i => (i + 1) % 3)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [idx])

  const slides = [
    <SlideProblem key="problem" />,
    <SlideSolution key="solution" />,
    <SlideSavings key="savings" onCTA={scrollToSearch} />,
  ]

  return (
    <section className="relative overflow-hidden text-white" style={{ height: "100vh", minHeight: 640 }}>
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === idx ? 1 : 0,
            transform: i === idx ? "translateY(0)" : i < idx ? "translateY(-2%)" : "translateY(2%)",
            transition: "opacity 700ms ease, transform 900ms cubic-bezier(0.2,0.7,0.2,1)",
            pointerEvents: i === idx ? "auto" : "none",
          }}
        >
          {slide}
        </div>
      ))}

      {/* Progress indicators */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {[0, 1, 2].map(i => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="relative overflow-hidden cursor-pointer"
            style={{
              height: 4, borderRadius: 999,
              width: i === idx ? 64 : 24,
              background: "rgba(255,255,255,0.25)",
              border: "none", padding: 0,
              transition: "width 400ms ease",
            }}
            aria-label={`Slide ${i + 1}`}
          >
            {i === idx && (
              <div
                className="absolute inset-0 rounded-full bg-white"
                style={{ width: `${progress * 100}%` }}
              />
            )}
            {i !== idx && <div className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />}
          </button>
        ))}
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-4 right-6 text-xs tracking-widest uppercase opacity-60 z-10 font-mono">
        Défilez pour explorer ↓
      </div>
    </section>
  )
}
