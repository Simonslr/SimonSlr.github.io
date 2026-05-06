import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink, ShieldCheck, Package, RefreshCw, Info } from "lucide-react"
import products from "@/data/products.json"
import type { Product } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"
import RecommendationBanner from "@/components/RecommendationBanner"
import ComparisonTable from "@/components/ComparisonTable"
import Flag from "@/components/Flag"
import ProductImage from "@/components/ProductImage"

interface Props {
  params: Promise<{ slug: string }>
}

const COUNTRY_NAME: Record<string, string> = { FR: "France", DE: "Allemagne", ES: "Espagne" }
const COUNTRY_AMZ: Record<string, string> = { FR: "Amazon.fr", DE: "Amazon.de", ES: "Amazon.es" }

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
    <main style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="max-w-screen-xl mx-auto" style={{ padding: "32px 56px 96px" }}>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors font-medium no-underline">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            Accueil
          </Link>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
          <span className="text-indigo-500 font-medium">{product.category}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
          <span className="text-slate-700 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Hero — 2 columns */}
        <div className="grid gap-12 items-start mb-24" style={{ gridTemplateColumns: "1.05fr 1fr" }}>

          {/* Left — image */}
          <div>
            <div className="w-full rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center" style={{ background: "#F8FAFC", minHeight: 460 }}>
              <ProductImage id={product.id} imageUrl={product.image} alt={product.name} size={460} />
            </div>
            <div className="flex gap-3 mt-4">
              {["Vue A", "Vue B", "Vue C", "Packaging"].map(v => (
                <div
                  key={v}
                  className="rounded-xl border border-slate-200 flex items-center justify-center font-mono text-xs text-slate-300 tracking-wider uppercase"
                  style={{ width: 88, height: 68, background: "#F8FAFC", letterSpacing: "0.1em" }}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/* Right — info */}
          <div>
            <span
              className="inline-block text-xs font-black tracking-widest uppercase font-mono mb-4"
              style={{ padding: "5px 10px", borderRadius: 6, background: "#EEF2FF", color: "#4F46E5" }}
            >
              {product.category}
            </span>

            <h1
              className="font-black text-slate-900 m-0 mb-4"
              style={{ fontSize: 44, letterSpacing: "-0.035em", lineHeight: 1.05, textWrap: "balance" }}
            >
              {product.name}
            </h1>

            <p className="text-base text-slate-500 leading-relaxed mb-7">{product.description}</p>

            {/* Best price banner */}
            {reco && (
              <div className="mb-5">
                <RecommendationBanner reco={reco} />
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-indigo-400" /> Vendeur officiel</span>
              <span className="flex items-center gap-1.5"><Package size={13} className="text-indigo-400" /> Livraison incluse</span>
              {reco && <span className="flex items-center gap-1.5"><RefreshCw size={13} className="text-indigo-400" /> Mis à jour le {reco.best.offer.updated_at}</span>}
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mb-6">
          <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: 28, letterSpacing: "-0.025em" }}>
            Comparaison détaillée
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Prix total livraison incluse vers la France, chez les vendeurs officiels.
          </p>
          {reco ? (
            <ComparisonTable reco={reco} />
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-700">
              Données insuffisantes pour établir une comparaison.
            </div>
          )}
        </div>

        {/* Legal note */}
        <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
          <Info size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed m-0">
            Les frais de livraison sont des estimations vers la France métropolitaine et peuvent varier selon le poids,
            le volume et les promotions en cours. Vérifiez le prix final sur le site du vendeur avant d'acheter.
          </p>
        </div>
      </div>
    </main>
  )
}
