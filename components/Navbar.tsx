import Link from "next/link"
import EuroPrixLogo from "./EuroPrixLogo"

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200"
      style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "saturate(180%) blur(14px)", height: 72 }}
    >
      <div className="max-w-screen-xl mx-auto px-14 h-full flex items-center justify-between gap-6">
        <Link href="/" style={{ flexShrink: 0 }}>
          <EuroPrixLogo size={36} />
        </Link>

        <div
          className="hidden sm:inline-flex items-center gap-2.5 text-sm text-slate-600 font-medium border border-slate-200 bg-white rounded-full px-4 py-2"
        >
          <span className="relative flex" style={{ width: 8, height: 8 }}>
            <span className="animate-ep-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative rounded-full bg-emerald-500" style={{ width: 8, height: 8 }} />
          </span>
          <span>
            <strong className="text-slate-900 font-semibold">Prix vérifiés</strong>
            {" · "}Vendeurs officiels · Livraison incluse
          </span>
        </div>

        <Link
          href="/#products"
          className="flex-shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5"
        >
          Voir tous les produits
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </header>
  )
}
