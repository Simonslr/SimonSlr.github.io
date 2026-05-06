import Link from "next/link"
import type { Product, CountryCode } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"
import Flag from "./Flag"
import ProductImage from "./ProductImage"

const COUNTRIES: CountryCode[] = ["FR", "DE", "ES"]
const COUNTRY_AMZ: Record<CountryCode, string> = { FR: "Amazon.fr", DE: "Amazon.de", ES: "Amazon.es" }

export default function ProductCard({ product }: { product: Product }) {
  const reco = getRecommendation(product)

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="card-lift group block bg-white border border-slate-200 rounded-2xl overflow-hidden"
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-6 pt-6 pb-0">
        <span className="text-xs font-bold tracking-widest uppercase text-slate-400 font-mono">
          {product.category}
        </span>
        {reco && (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border animate-ep-pulse"
            style={{ background: "#ECFDF5", color: "#059669", borderColor: "#A7F3D0" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m3 7 7 7 4-4 7 7"/><path d="M14 17h7v-7"/></svg>
            −{reco.savings_pct.toFixed(0)}%
          </span>
        )}
      </div>

      {/* Product identity */}
      <div className="flex items-start gap-4 px-6 py-5">
        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-slate-100" style={{ background: "#F8FAFC" }}>
          <ProductImage id={product.id} imageUrl={product.image} alt={product.name} size={64} />
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors tracking-tight m-0">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{product.description.split(",")[0]}</p>
        </div>
      </div>

      {/* Mini price grid */}
      <div className="grid grid-cols-3 gap-1.5 mx-6 mb-5 p-1.5 rounded-xl border border-slate-100" style={{ background: "#F8FAFC" }}>
        {COUNTRIES.map(c => {
          const offer = product.prices[c]
          const total = offer ? offer.price + offer.shipping : null
          const isBest = reco?.best.country === c
          const isWorst = reco ? reco.ranked[reco.ranked.length - 1].country === c && reco.ranked.length > 1 : false
          return (
            <div
              key={c}
              className="rounded-lg text-center py-3 px-2"
              style={{
                background: isBest ? "#fff" : "transparent",
                border: isBest ? "1.5px solid #059669" : "1.5px solid transparent",
                boxShadow: isBest ? "0 4px 14px -4px rgba(5,150,105,0.25)" : "none",
              }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <Flag country={c} size={14} />
                <span className="text-xs font-bold text-slate-500 font-mono tracking-wider">{c}</span>
              </div>
              {total !== null ? (
                <>
                  <div
                    className="font-black text-lg leading-none"
                    style={{ letterSpacing: "-0.02em", color: isBest ? "#059669" : isWorst ? "#F43F5E" : "#0F172A" }}
                  >
                    {total.toFixed(0)} €
                  </div>
                  {isBest && (
                    <div className="mt-1 text-[9px] font-bold tracking-widest uppercase text-emerald-600 font-mono">
                      MEILLEUR
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-slate-300 font-medium">N/A</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      {reco && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-700">
            Économisez{" "}
            <strong className="font-bold" style={{ color: "#059669" }}>{reco.savings.toFixed(2)} €</strong>
            <span className="text-slate-400"> sur {COUNTRY_AMZ[reco.best.country]}</span>
          </p>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:bg-indigo-600"
            style={{ background: "#EEF2FF" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-indigo-600 group-hover:text-white transition-colors" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      )}
    </Link>
  )
}
