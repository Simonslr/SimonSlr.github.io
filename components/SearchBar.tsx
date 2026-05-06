"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight } from "lucide-react"
import type { Product } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"

export default function SearchBar({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return }
    const q = query.toLowerCase()
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
    setResults(filtered.slice(0, 6))
    setOpen(filtered.length > 0)
  }, [query, products])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function select(product: Product) {
    setQuery(""); setOpen(false)
    router.push(`/produit/${product.slug}`)
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un produit — ex : AirPods, PS5, SSD..."
          className="w-full pl-11 pr-28 py-3.5 text-sm bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
          Comparer
          <ArrowRight size={12} />
        </button>
      </div>

      {open && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 divide-y divide-slate-50">
          {results.map(product => {
            const reco = getRecommendation(product)
            return (
              <button
                key={product.id}
                onClick={() => select(product)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-left transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 p-1">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-700">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.category}</p>
                </div>
                {reco && (
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-slate-800">{reco.best.total.toFixed(0)} €</p>
                    <p className="text-xs text-emerald-600 font-semibold">-{reco.savings_pct.toFixed(0)}%</p>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
