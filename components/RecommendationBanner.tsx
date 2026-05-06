import { ExternalLink, ShieldCheck, Package, RefreshCw } from "lucide-react"
import type { Recommendation } from "@/lib/types"
import Flag from "./Flag"

const COUNTRY_NAME: Record<string, string> = { FR: "France", DE: "Allemagne", ES: "Espagne" }
const COUNTRY_AMZ: Record<string, string> = { FR: "Amazon.fr", DE: "Amazon.de", ES: "Amazon.es" }

export default function RecommendationBanner({ reco }: { reco: Recommendation }) {
  const { best, savings, savings_pct } = reco

  return (
    <div
      className="rounded-2xl text-white relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#059669 0%,#0D9488 100%)", padding: 28 }}
    >
      {/* Decorative circles */}
      <div className="absolute rounded-full pointer-events-none" style={{ top: -40, right: -40, width: 200, height: 200, background: "rgba(255,255,255,0.08)" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: -60, left: -30, width: 180, height: 180, background: "rgba(255,255,255,0.05)" }} />

      <div className="relative flex flex-col gap-5">
        {/* Badge */}
        <div>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase font-mono"
            style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,0.15)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z"/>
            </svg>
            Meilleur prix trouvé
          </span>
        </div>

        {/* Country + price row */}
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Flag country={best.country} size={28} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80 m-0">{COUNTRY_NAME[best.country]}</p>
                <p className="text-xs text-white/70 m-0">Vendu par <span className="font-semibold text-white">{best.offer.seller}</span></p>
              </div>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold font-mono animate-ep-pulse"
                style={{ padding: "4px 10px", borderRadius: 999, background: "#fff", color: "#059669" }}
              >
                −{savings_pct.toFixed(0)}%
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-black text-white" style={{ fontSize: 68, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {best.total.toFixed(2)}
              </span>
              <span className="text-2xl font-medium text-white/60">€</span>
            </div>
            <p className="text-sm text-white/75 mt-2 m-0">
              {best.offer.price.toFixed(2)} €{" "}
              {best.offer.shipping === 0 ? "+ livraison gratuite" : `+ ${best.offer.shipping.toFixed(2)} € livraison`}
            </p>
          </div>
        </div>

        {/* CTA — full width, centered */}
        <a
          href={best.offer.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 font-bold text-base w-full transition-all hover:shadow-xl hover:-translate-y-0.5"
          style={{
            padding: "18px 24px", borderRadius: 14,
            background: "#fff", color: "#059669",
            boxShadow: "0 12px 32px -8px rgba(0,0,0,0.3)",
          }}
        >
          Acheter sur {COUNTRY_AMZ[best.country]}
          <ExternalLink size={18} />
        </a>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-4 text-xs text-white/75 justify-center">
          <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-white/60" /> Vendeur officiel</span>
          <span className="flex items-center gap-1.5"><Package size={12} className="text-white/60" /> Livraison incluse</span>
          <span className="flex items-center gap-1.5"><RefreshCw size={12} className="text-white/60" /> Mis à jour le {best.offer.updated_at}</span>
        </div>
      </div>
    </div>
  )
}
