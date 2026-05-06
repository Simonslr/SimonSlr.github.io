import { Check, ExternalLink, Package } from "lucide-react"
import type { Recommendation } from "@/lib/types"
import Flag from "./Flag"

const countryName: Record<string, string> = { FR: "France", DE: "Allemagne", ES: "Espagne" }

export default function ComparisonTable({ reco }: { reco: Recommendation }) {
  const bestTotal = reco.best.total
  const worstTotal = reco.ranked[reco.ranked.length - 1].total

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Comparaison détaillée</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Vendeurs officiels · Prix TTC · Livraison vers la France
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Meilleur prix
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-300 inline-block" />
            Plus cher
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="text-left px-6 py-3">Pays</th>
              <th className="text-left px-6 py-3">Vendeur</th>
              <th className="text-right px-6 py-3">Prix</th>
              <th className="text-right px-6 py-3">Livraison</th>
              <th className="text-right px-6 py-3 font-bold text-slate-600">Total</th>
              <th className="px-6 py-3 text-right">Diff.</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {reco.ranked.map((item, index) => {
              const isBest = index === 0
              const isWorst = index === reco.ranked.length - 1 && reco.ranked.length > 1
              const diff = item.total - bestTotal
              const diffPct = ((item.total - bestTotal) / bestTotal) * 100

              return (
                <tr
                  key={item.country}
                  className={`border-b border-slate-50 last:border-0 transition-colors ${
                    isBest ? "bg-emerald-50/70" : isWorst ? "bg-red-50/40" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      {isBest && (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check size={10} className="text-emerald-600" strokeWidth={3} />
                        </div>
                      )}
                      <Flag country={item.country} size={20} />
                      <span className="font-medium text-slate-700">{countryName[item.country]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{item.offer.seller}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{item.offer.price.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-right">
                    {item.offer.shipping === 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                        <Package size={11} />
                        Gratuite
                      </span>
                    ) : (
                      <span className="text-slate-500">{item.offer.shipping.toFixed(2)} €</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-base font-bold ${
                      isBest ? "text-emerald-700" : isWorst ? "text-red-500" : "text-slate-800"
                    }`}>
                      {item.total.toFixed(2)} €
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-semibold">
                    {isBest ? (
                      <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Référence</span>
                    ) : (
                      <span className={`${isWorst ? "text-red-500" : "text-slate-400"}`}>
                        +{diff.toFixed(2)} € ({diffPct.toFixed(0)}%)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={item.offer.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        isBest
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      Voir
                      <ExternalLink size={10} />
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Mis à jour le {reco.best.offer.updated_at}
        </p>
        <p className="text-xs text-slate-400">
          Frais de livraison estimés vers la France · Vérifiez au checkout
        </p>
      </div>
    </div>
  )
}
