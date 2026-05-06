import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Info, ArrowLeft } from "lucide-react"
import products from "@/data/products.json"
import type { Product } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"
import RecommendationBanner from "@/components/RecommendationBanner"
import ComparisonTable from "@/components/ComparisonTable"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return (products as Product[]).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = (products as Product[]).find(p => p.slug === slug)
  if (!product) return {}
  return {
    title: `${product.name} — Meilleur prix Europe | EuroPrix`,
    description: `Prix de ${product.name} comparé entre France, Allemagne et Espagne, livraison incluse.`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = (products as Product[]).find(p => p.slug === slug)
  if (!product) notFound()

  const reco = getRecommendation(product)

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">

      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft size={12} />
          Retour
        </Link>
        <ChevronRight size={11} />
        <span className="text-xs font-medium text-indigo-500">{product.category}</span>
        <ChevronRight size={11} />
        <span className="text-slate-600 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* En-tête produit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 p-3 shadow-inner">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-2 tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Recommandation */}
      {reco ? (
        <div className="mb-6 animate-fade-in-up">
          <RecommendationBanner reco={reco} />
        </div>
      ) : (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-700">
          Données insuffisantes pour établir une recommandation.
        </div>
      )}

      {/* Tableau comparatif */}
      {reco && (
        <div className="mb-6">
          <ComparisonTable reco={reco} />
        </div>
      )}

      {/* Avertissement */}
      <div className="flex items-start gap-3 bg-slate-100 border border-slate-200 rounded-xl p-4">
        <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Les frais de livraison sont des estimations vers la France. Vérifiez le prix final sur le site du vendeur avant d&apos;acheter. Les prix varient sans préavis.
        </p>
      </div>
    </main>
  )
}
