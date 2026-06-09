import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import products from "@/data/products.json"
import type { Product, Recommendation } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"
import Flag from "@/components/Flag"
import DesignNavbar from "@/components/DesignNavbar"
import ProductUserSection from "@/components/ProductUserSection"
import { safeJsonLd } from "@/lib/security"

interface Props { params: Promise<{ slug: string }> }

const COUNTRY_AMZ: Record<string, string> = {
  FR: "Amazon.fr",
  DE: "Amazon.de",
  ES: "Amazon.es",
}

function fmt(n: number) {
  return n % 1 === 0 ? n.toFixed(0) + " €" : n.toFixed(2).replace(".", ",") + " €"
}

export async function generateStaticParams() {
  return (products as Product[]).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = (products as Product[]).find(p => p.slug === slug)
  if (!product) return {}
  const reco = getRecommendation(product)
  const saving = reco ? ` — Économisez ${Math.round(reco.savings)} €` : ""
  return {
    title: `${product.name}${saving} | CompareUro`,
    description: `Comparez le prix du ${product.name} entre Amazon France, Allemagne et Espagne. Livraison incluse, vendeurs officiels.`,
    openGraph: {
      title: `${product.name} — Meilleur prix Amazon Europe`,
      description: `Achetez ${product.name} au meilleur prix en Europe. Livraison incluse.`,
      type: "website",
    },
  }
}

function CmpRow({ item, rank, worstTotal }: {
  item: Recommendation["ranked"][number]
  rank: "best" | "mid" | "worst"
  worstTotal: number
}) {
  const isBest  = rank === "best"
  const isWorst = rank === "worst"
  const barPct  = Math.round((item.total / worstTotal) * 100)

  return (
    <div className={`cmp__row${isBest ? " is-best" : ""}${isWorst ? " is-worst" : ""}`}>
      <Flag country={item.country} size={18} />
      <div className="row-name">
        <span className="row-marketplace">
          {COUNTRY_AMZ[item.country]}
          {isBest && (
            <span style={{ color: "var(--green)", fontSize: 13, fontWeight: 400, marginLeft: 8 }}>
              · meilleur prix
            </span>
          )}
        </span>
        <span className="row-detail">
          {fmt(item.offer.price)}
          {item.offer.shipping > 0
            ? ` produit · ${fmt(item.offer.shipping)} livraison`
            : " · livraison gratuite"}
        </span>
      </div>
      <div className={`row-bar bar-${rank}`}>
        <span style={{ width: `${barPct}%` }} />
      </div>
      <span className="row-price">{fmt(item.total)}</span>
      <span className="row-cta">
        <a
          href={item.offer.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          className={isBest ? "btn btn--primary" : "btn btn--ghost"}
          style={{ fontSize: 13, padding: isBest ? "10px 16px" : "9px 14px" }}
        >
          {isBest ? `Acheter sur ${COUNTRY_AMZ[item.country]}` : "Acheter"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
          </svg>
        </a>
      </span>
    </div>
  )
}

function RelatedProducts({ current, all }: { current: Product; all: Product[] }) {
  const related = all
    .filter(p => p.id !== current.id && p.category === current.category)
    .slice(0, 3)
  if (related.length === 0) return null

  return (
    <section className="rel">
      <div className="wrap">
        <div className="rel__head">
          <h2 className="rel__title">Dans la même catégorie</h2>
          <Link href="/#catalogue" className="rel__more">Voir tout →</Link>
        </div>
        <div className="rel__grid">
          {related.map(p => {
            const reco = getRecommendation(p)
            const brand = p.name.split(" ")[0]
            return (
              <Link key={p.id} href={`/produit/${p.slug}`} className="rel-card">
                <div className="rel-card__media">
                  {p.image
                    ? <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: 16 }} />
                    : <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 12, color: "var(--text-mute)" }}>{p.name}</span>
                  }
                </div>
                <div className="rel-card__body">
                  <div className="rel-card__brand">{brand}</div>
                  <div className="rel-card__name">{p.name}</div>
                  {reco && reco.savings > 0 && (
                    <div className="rel-card__save">
                      <span className="pill">−{fmt(reco.savings)}</span>
                      <span className="vs">vs le plus cher</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = (products as Product[]).find(p => p.slug === slug)
  if (!product) notFound()

  const reco        = getRecommendation(product)
  const allProducts = products as Product[]
  const worst       = reco?.ranked[reco.ranked.length - 1]
  const pageUrl     = `https://eurocomp.vercel.app/produit/${product.slug}`
  const brand       = product.name.split(" ")[0]
  const nbMarkets   = reco?.ranked.length ?? 0

  const jsonLd = reco ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image ? `https://eurocomp.vercel.app${product.image}` : undefined,
    "brand": { "@type": "Brand", "name": brand },
    "offers": reco.ranked.map((r) => ({
      "@type": "Offer",
      "url": r.offer.affiliate_url,
      "priceCurrency": "EUR",
      "price": r.total.toFixed(2),
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": COUNTRY_AMZ[r.country] },
    })),
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      )}
      <DesignNavbar />

      <main style={{ paddingTop: 64, background: "var(--bg)" }}>

        <div className="wrap">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link href="/">← Accueil</Link>
            <span className="sep">/</span>
            <span>{product.category}</span>
            <span className="sep">/</span>
            <span className="current">{product.name}</span>
          </nav>
        </div>

        <section className="pdp-hero">
          <div className="wrap">
            <div className="pdp-hero__grid">

              <figure className="pdp-hero__media">
                {product.image
                  ? <Image src={product.image} alt={product.name} fill priority style={{ objectFit: "contain", padding: 32 }} />
                  : <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 13, color: "var(--text-mute)" }}>{product.name}</span>
                }
              </figure>

              <div className="pdp-hero__info">
                <div className="pdp-hero__category">
                  <span className="brand">{brand}</span> · {product.category}
                </div>

                <h1 className="pdp-hero__title">{product.name}</h1>

                <p className="pdp-hero__desc">{product.description}</p>

                {reco && (
                  <div className="price-block">
                    {reco.savings > 0 && (
                      <div className="save-row">
                        <span className="save-pill">−{fmt(reco.savings)}</span>
                        <span className="vs">vs le prix le plus cher</span>
                      </div>
                    )}

                    <div className="price-line">
                      <span className="price-now">{fmt(reco.best.total)}</span>
                      {worst && worst.total > reco.best.total && (
                        <span className="price-was">{fmt(worst.total)}</span>
                      )}
                    </div>

                    <div className="price-caption">
                      <Flag country={reco.best.country} size={16} />
                      <span>Sur <b>{COUNTRY_AMZ[reco.best.country]}</b></span>
                      <span className="dot">·</span>
                      <span>livraison incluse</span>
                      <span className="dot">·</span>
                      <span>vendeur officiel</span>
                    </div>

                    {/* Main CTA — always visible, no auth needed */}
                    <div className="pdp-cta-row">
                      <a
                        href={reco.best.offer.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--primary"
                        style={{ fontSize: 15, padding: "14px 22px", borderRadius: 10 }}
                      >
                        Acheter sur {COUNTRY_AMZ[reco.best.country]}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                        </svg>
                      </a>
                    </div>

                    {/* Auth-dependent: favorite, share, alerts, price chart — loads client-side */}
                    <ProductUserSection
                      slug={slug}
                      name={product.name}
                      bestPrice={reco.best.total}
                      bestCountry={reco.best.country}
                      pageUrl={pageUrl}
                    />

                    <div className="pdp-trust-line">
                      <span className="fresh">Prix mis à jour {reco.best.offer.updated_at}</span>
                      <span>Livraison incluse</span>
                      <span>Vendeur officiel</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {reco && (
          <section className="cmp">
            <div className="wrap">
              <div className="cmp__head">
                <h2 className="cmp__title">Comparaison des prix</h2>
                <div className="cmp__count">
                  {nbMarkets} marketplace{nbMarkets > 1 ? "s" : ""} · prix livraison incluse
                </div>
              </div>
              <div className="cmp__rows">
                {reco.ranked.map((item, i) => {
                  const rank = i === 0
                    ? "best"
                    : i === reco.ranked.length - 1 && reco.ranked.length > 1
                      ? "worst"
                      : "mid"
                  return (
                    <CmpRow
                      key={item.country}
                      item={item}
                      rank={rank as "best" | "mid" | "worst"}
                      worstTotal={worst?.total ?? item.total}
                    />
                  )
                })}
              </div>
              <p className="cmp__note">
                Frais de livraison estimés vers la France métropolitaine. Vérifiez le prix final sur Amazon avant d&apos;acheter.
                CompareUro participe au Programme Partenaires Amazon EU et perçoit une commission sur les ventes qualifiées.
              </p>
            </div>
          </section>
        )}

        <RelatedProducts current={product} all={allProducts} />

        <div className="pdp-bottom-link">
          <div className="wrap">
            <Link href="/#catalogue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
              Voir tous les produits
            </Link>
          </div>
        </div>

      </main>
    </>
  )
}
