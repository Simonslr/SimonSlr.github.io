import products from "@/data/products.json"
import type { Product } from "@/lib/types"
import { ShieldCheck, Package, RefreshCw, Zap } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import ProductCard from "@/components/ProductCard"

export default function HomePage() {
  const allProducts = products as Product[]

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero-grid border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">

          {/* Badge live */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            10 produits comparés · France, Allemagne, Espagne
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight mb-5 animate-fade-in-up delay-100">
            Comparez les prix Amazon<br />
            <span className="text-indigo-600">en Europe</span> et économisez<br />
            <span className="text-emerald-600">jusqu&apos;à 30%</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            On calcule le prix total livraison incluse chez les vendeurs officiels en France, Allemagne et Espagne —
            et on vous dit exactement où acheter.
          </p>

          <div className="animate-fade-in-up delay-300">
            <SearchBar products={allProducts} />
          </div>

          {/* Trust micro-badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-fade-in-up delay-400">
            {[
              { icon: <ShieldCheck size={13} />, label: "Vendeurs officiels uniquement" },
              { icon: <Package size={13} />, label: "Livraison incluse" },
              { icon: <RefreshCw size={13} />, label: "Prix vérifiés régulièrement" },
              { icon: <Zap size={13} />, label: "Résultat en 1 clic" },
            ].map(item => (
              <span key={item.label} className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="text-indigo-400">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: "jusqu'à 30%", label: "d'économie possible" },
            { value: "3 pays", label: "France · Allemagne · Espagne" },
            { value: "100%", label: "Vendeurs officiels" },
            { value: "Gratuit", label: "Sans inscription" },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-lg font-black">{stat.value}</p>
              <p className="text-indigo-200 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* ── COMMENT ÇA MARCHE ── */}
        <section className="mb-16">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-8">
            Comment ça marche
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                color: "bg-indigo-50 text-indigo-600 border-indigo-100",
                title: "Cherchez un produit",
                desc: "Tapez le nom d'un produit dans la barre de recherche en haut de page.",
              },
              {
                step: "02",
                color: "bg-violet-50 text-violet-600 border-violet-100",
                title: "On compare les 3 pays",
                desc: "On calcule le prix total livraison incluse chez les vendeurs officiels.",
              },
              {
                step: "03",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                title: "Achetez moins cher",
                desc: "Suivez le lien direct et économisez immédiatement sur votre commande.",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2 -translate-y-1/2 z-10 text-slate-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                )}
                <span className={`inline-block text-xs font-black px-2.5 py-1 rounded-lg border mb-4 ${item.color}`}>
                  {item.step}
                </span>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUITS ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Produits comparés</h2>
              <p className="text-sm text-slate-400 mt-0.5">Cliquez sur un produit pour voir le détail de la comparaison</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
              {allProducts.length} produits
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── GARANTIES ── */}
        <section className="mt-16 bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-8">
            Pourquoi nous faire confiance
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck size={20} className="text-indigo-600" />,
                title: "Vendeurs officiels uniquement",
                desc: "Uniquement Amazon direct et grandes enseignes. Zéro marketplace tiers, zéro vendeur inconnu.",
              },
              {
                icon: <Package size={20} className="text-indigo-600" />,
                title: "Prix livraison incluse",
                desc: "Le prix affiché intègre les frais de port estimés vers la France pour une comparaison réaliste.",
              },
              {
                icon: <RefreshCw size={20} className="text-indigo-600" />,
                title: "Données actualisées",
                desc: "La date de dernière mise à jour est indiquée sur chaque fiche. Toujours vérifier au checkout.",
              },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
