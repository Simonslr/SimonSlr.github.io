"use client"

import Link from "next/link"
import SearchBar from "./SearchBar"
import type { Product } from "@/lib/types"

const TRENDING = [
  { label: "AirPods Pro",       slug: "airpods-pro-2" },
  { label: "SSD 1 To",          slug: "ssd-samsung-990-pro-1tb" },
  { label: "Casque ANC",        slug: "sony-wh1000xm5" },
  { label: "Console next-gen",  slug: "ps5-slim" },
]

export default function SearchSection({ products }: { products: Product[] }) {
  return (
    <section id="search-section" style={{ padding: "120px 56px", background: "#fff" }}>
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-6"
          style={{ padding: "6px 14px", borderRadius: 999, background: "#ECFDF5", color: "#059669", fontFamily: "ui-monospace,monospace" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z"/></svg>
          Résultat instantané
        </div>

        <h2
          className="font-black text-slate-900 mt-0 mb-4"
          style={{ fontSize: 60, letterSpacing: "-0.035em", lineHeight: 1.05, textWrap: "balance" }}
        >
          Quel produit voulez-vous comparer&nbsp;?
        </h2>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
          Saisissez un nom, une marque ou collez l'URL d'une page produit.
        </p>

        <div className="mb-5">
          <SearchBar products={products} />
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">Tendances</span>
          {TRENDING.map(t => (
            <Link
              key={t.slug}
              href={`/produit/${t.slug}`}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-slate-600 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-colors no-underline"
              style={{ background: "#F8FAFC" }}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
