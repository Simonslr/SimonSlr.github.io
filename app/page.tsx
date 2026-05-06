import products from "@/data/products.json"
import type { Product } from "@/lib/types"
import IntroSplash from "@/components/IntroSplash"
import HeroCarousel from "@/components/HeroCarousel"
import StatsBar from "@/components/StatsBar"
import SearchSection from "@/components/SearchSection"
import HowItWorks from "@/components/HowItWorks"
import ProductCard from "@/components/ProductCard"
import Guarantees from "@/components/Guarantees"

const allProducts = products as Product[]

export default function HomePage() {
  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <IntroSplash />
      <HeroCarousel />
      <StatsBar />
      <SearchSection products={allProducts} />
      <HowItWorks />

      {/* Products grid */}
      <section id="products" style={{ padding: "120px 56px", background: "#F8FAFC" }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between gap-8 flex-wrap mb-16">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 font-mono mb-4">
                Catalogue · Mis à jour aujourd'hui
              </div>
              <h2 className="font-black text-slate-900 m-0" style={{ fontSize: 52, letterSpacing: "-0.035em", lineHeight: 1.05 }}>
                Produits comparés.
              </h2>
              <p className="text-lg text-slate-500 mt-4 leading-relaxed max-w-2xl">
                Cliquez sur un produit pour voir le détail de la comparaison entre la France, l'Allemagne et l'Espagne.
              </p>
            </div>
            <div
              className="text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-full px-4 py-2 flex-shrink-0"
              style={{ background: "#EEF2FF" }}
            >
              {allProducts.length} produits
            </div>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {allProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Guarantees />
    </main>
  )
}
