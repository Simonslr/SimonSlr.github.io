import { ExternalLink, TrendingDown, ShieldCheck } from "lucide-react"
import type { Recommendation } from "@/lib/types"
import Flag from "./Flag"

const countryName: Record<string, string> = { FR: "France", DE: "Allemagne", ES: "Espagne" }

export default function RecommendationBanner({ reco }: { reco: Recommendation }) {
  const { best, savings, savings_pct } = reco

  return (
    <div className="relative bg-white rounded-2xl border-2 border-emerald-200 overflow-hidden shadow-sm">
      {/* Accent bar top */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400 w-full" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          {/* Left — price info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                <TrendingDown size={11} strokeWidth={2.5} />
                Meilleur prix trouvé
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Flag country={best.country} size={28} />
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {countryName[best.country]}
                </p>
                <p className="text-xs text-slate-500">
                  Vendu par <span className="font-semibold text-slate-700">{best.offer.seller}</span>
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-900 tracking-tight">
                  {best.total.toFixed(2)}
                </span>
                <span className="text-xl font-medium text-slate-400">€</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {best.offer.price.toFixed(2)} €{" "}
                {best.offer.shipping === 0
                  ? "+ livraison gratuite"
                  : `+ ${best.offer.shipping.toFixed(2)} € livraison`}
              </p>
            </div>
          </div>

          {/* Right — savings + CTA */}
          <div className="flex flex-col gap-4 sm:items-end">
            <div className="best-price-pulse bg-emerald-500 text-white rounded-2xl px-6 py-4 text-center flex-shrink-0">
              <p className="text-4xl font-black leading-none">-{savings_pct.toFixed(0)}%</p>
              <p className="text-emerald-100 text-sm mt-1">soit {savings.toFixed(2)} € économisés</p>
            </div>

            <a
              href={best.offer.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm text-sm w-full sm:w-auto"
            >
              Acheter sur {best.offer.seller}
              <ExternalLink size={14} />
            </a>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck size={12} className="text-emerald-500" />
              Vendeur officiel vérifié
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
