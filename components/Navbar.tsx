import Link from "next/link"

export default function Navbar() {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-base">EuroPrix</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
          Prix vérifiés · Vendeurs officiels · Livraison incluse
        </div>

        <Link
          href="/"
          className="flex-shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Voir tous les produits
        </Link>
      </div>
    </header>
  )
}
