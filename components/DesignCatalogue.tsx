"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Flag from "./Flag"
import { getCatalogueProducts, type DesignProduct } from "@/lib/design-data"

const COUNTRY_AMAZON: Record<string, string> = {
  FR: "Amazon.fr",
  DE: "Amazon.de",
  ES: "Amazon.es",
}

const SORTS = [
  { id: "savings",    label: "Économie max" },
  { id: "price-asc",  label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
] as const

type SortId          = typeof SORTS[number]["id"]
type CountryFilterId = "all" | "FR" | "DE" | "ES"

function formatEURSmart(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) + " €" : n.toFixed(2) + " €"
}
function getPriceMin(prices: Record<string, number>): number {
  return Math.min(...Object.values(prices))
}
function getSavings(prices: Record<string, number>): number {
  const vals = Object.values(prices)
  return Math.max(...vals) - Math.min(...vals)
}

export default function DesignCatalogue() {
  const items    = useMemo(() => getCatalogueProducts(), [])
  const inputRef = useRef<HTMLInputElement>(null)
  const gridRef  = useRef<HTMLDivElement>(null)

  const [query,   setQuery]   = useState("")
  const [sort,    setSort]    = useState<SortId>("savings")
  const [country, setCountry] = useState<CountryFilterId>("all")
  const [phase,   setPhase]   = useState<"in" | "out">("in")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let r = items.filter((p: DesignProduct) => {
      const inQ = !q || (p.title + " " + p.brand).toLowerCase().includes(q)
      const inC = country === "all" || p.bestCountry === country
      return inQ && inC
    })
    r = [...r].sort((a: DesignProduct, b: DesignProduct) => {
      if (sort === "savings")    return getSavings(b.prices)   - getSavings(a.prices)
      if (sort === "price-asc")  return getPriceMin(a.prices)  - getPriceMin(b.prices)
      if (sort === "price-desc") return getPriceMin(b.prices)  - getPriceMin(a.prices)
      return 0
    })
    return r
  }, [items, query, sort, country])

  const filterKey = `${sort}|${country}|${query}`
  const lastKey   = useRef(filterKey)
  useEffect(() => {
    if (lastKey.current === filterKey) return
    lastKey.current = filterKey
    setPhase("out")
    const t = setTimeout(() => setPhase("in"), 220)
    return () => clearTimeout(t)
  }, [filterKey])

  const handleCompare = () => {
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      {/* SEARCH */}
      <section id="comparateur" className="section search-sec">
        <div className="wrap">
          <div className="search-sec__head">
            <h2 className="h-section" data-reveal="fade">
              Quel produit<br />
              cherchez-<span className="em-serif" style={{ color: "var(--blue)" }}>vous&nbsp;?</span>
            </h2>
            <p className="sub" style={{ marginTop: 24 }} data-reveal="fade">
              Filtrez notre sélection de produits — prix mis à jour quotidiennement
              sur Amazon.fr, Amazon.de et Amazon.es, livraison incluse.
            </p>
          </div>

          <div className="search-box" data-reveal="fade">
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 14, flex: 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                id="product-search"
                name="product-search"
                type="text"
                placeholder="ex. Sony WH-1000XM5, iPad, Dyson…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                aria-label="Rechercher un produit"
                autoComplete="off"
              />
            </div>
            <button className="btn btn--primary" type="button" onClick={handleCompare} data-magnetic>
              Comparer
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="filters" data-reveal="fade">
            {SORTS.map((s) => (
              <button key={s.id} type="button" className={`chip${sort === s.id ? " on" : ""}`} onClick={() => setSort(s.id)}>
                {s.label}
              </button>
            ))}
            <span className="chip-sep" />
            <button type="button" className={`chip${country === "all" ? " on" : ""}`} onClick={() => setCountry("all")}>
              Tous pays
            </button>
            {(["FR", "DE", "ES"] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={`chip${country === c ? " on" : ""} chip--${c.toLowerCase()}`}
                onClick={() => setCountry(c)}
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <Flag country={c} size={12} />
                {c === "FR" ? "France" : c === "DE" ? "Allemagne" : "Espagne"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOGUE */}
      <section id="catalogue" className="section cat">
        <div className="wrap">
          <div ref={gridRef} className={`cat__grid is-${phase}`} data-filter-grid>
            {filtered.length === 0 && (
              <div className="cat__empty">Aucun produit ne correspond à ces filtres.</div>
            )}
            {filtered.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ProductCard({ p, index }: { p: DesignProduct; index: number }) {
  const best = p.bestCountry
  const save = getSavings(p.prices)
  const rows = ["FR", "DE", "ES"].filter((c) => p.prices[c] != null).map((c) => ({
    c, price: p.prices[c], isBest: c === best,
  }))

  return (
    <article
      className="card"
      data-reveal="card"
      data-best={best}
      style={{ ["--i" as string]: index } as React.CSSProperties}
    >
      <div className="card__inner">
        <Link href={`/produit/${p.slug}`} className="card__media" style={{ position: "relative", display: "block" }}>
          <span className="card__savings">−{formatEURSmart(save)}</span>
          <span className="card__flag-best">
            <Flag country={best} size={12} /> MIN
          </span>
          {p.image && (
            <Image src={p.image} alt={p.title} fill style={{ objectFit: "contain", padding: "8px" }} />
          )}
        </Link>

        <div className="card__body">
          <Link href={`/produit/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card__brand">{p.brand}</div>
            <div className="card__title" style={{ marginTop: 4 }}>{p.title}</div>
          </Link>

          <div className="card__prices">
            {rows.map((r) => (
              <div key={r.c} className={`card__price-row${r.isBest ? " best" : ""}`}>
                <Flag country={r.c} size={12} />
                <span className="cn">{COUNTRY_AMAZON[r.c]}</span>
                <span />
                <span className="pr">{formatEURSmart(r.price)}</span>
              </div>
            ))}
          </div>

          <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer" className="card__cta">
            Acheter sur {COUNTRY_AMAZON[best]}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Ouvre dans un nouvel onglet">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          <div className="card__updated">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" />
            </svg>
            {p.updated}
          </div>
        </div>
      </div>
    </article>
  )
}
