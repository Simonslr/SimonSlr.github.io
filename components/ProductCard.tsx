import Link from "next/link"
import { ArrowRight, TrendingDown } from "lucide-react"
import type { Product, CountryCode } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"
import Flag from "./Flag"

const COUNTRIES: CountryCode[] = ["FR", "DE", "ES"]

const countryName: Record<CountryCode, string> = { FR: "France", DE: "Allemagne", ES: "Espagne" }

export default function ProductCard({ product }: { product: Product }) {
  const reco = getRecommendation(product)

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="card-lift bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden group"
    >
      {/* Top bar — savings badge */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {product.category}
        </span>
        {reco && (
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
            <TrendingDown size={11} strokeWidth={2.5} />
            -{reco.savings_pct.toFixed(0)}%
          </span>
        )}
      </div>

      {/* Product header */}
      <div className="flex items-start gap-3 px-4 pb-4">
        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 p-1.5">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
            {product.name}
          </p>
        </div>
      </div>

      {/* Price grid — 3 colonnes */}
      <div className="grid grid-cols-3 gap-px bg-slate-100 border-t border-slate-100 flex-1">
        {COUNTRIES.map(country => {
          const offer = product.prices[country]
          const total = offer ? offer.price + offer.shipping : null
          const isBest = reco?.best.country === country
          const isWorst = reco ? reco.ranked[reco.ranked.length - 1].country === country : false

          return (
            <div
              key={country}
              className={`flex flex-col items-center justify-center py-4 gap-1.5 ${
                isBest
                  ? "bg-emerald-50"
                  : isWorst && reco && reco.ranked.length > 1
                  ? "bg-red-50/60"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Flag country={country} size={16} />
                <span className="text-xs font-semibold text-slate-500">{country}</span>
              </div>

              {total !== null ? (
                <>
                  <p className={`text-sm font-bold leading-none ${isBest ? "text-emerald-700" : isWorst && reco && reco.ranked.length > 1 ? "text-red-500" : "text-slate-800"}`}>
                    {total.toFixed(0)} €
                  </p>
                  {isBest && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full leading-none">
                      MEILLEUR
                    </span>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-300 font-medium">N/A</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer CTA */}
      {reco && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500">
            Économisez{" "}
            <span className="font-bold text-emerald-700">{reco.savings.toFixed(2)} €</span>{" "}
            sur {countryName[reco.best.country]}
          </p>
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors flex-shrink-0">
            <ArrowRight size={13} className="text-indigo-600 group-hover:text-white transition-colors" />
          </div>
        </div>
      )}
    </Link>
  )
}
