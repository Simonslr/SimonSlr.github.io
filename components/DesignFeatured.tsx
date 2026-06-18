import Image from "next/image"
import Flag from "./Flag"
import PriceRoller from "./PriceRoller"
import { getFeaturedProduct } from "@/lib/design-data"

const COUNTRY_AMAZON: Record<string, string> = { FR: "Amazon.fr", DE: "Amazon.de", ES: "Amazon.es" }

function formatEUR(n: number): string {
  // Intl.NumberFormat("fr-FR") produces different Unicode spacing chars
  // (NNBSP vs NBSP) on Node.js vs Chrome → SSR hydration mismatch.
  // This manual implementation is identical on both runtimes.
  const [int, dec] = n.toFixed(2).split(".")
  const thousands = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${thousands},${dec} €`
}
function formatEURSmart(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) + " €" : n.toFixed(2) + " €"
}

export default function DesignFeatured() {
  const featured = getFeaturedProduct()
  if (!featured) return null

  const best      = featured.bestCountry
  const allPrices = Object.entries(featured.prices)
  const worst     = allPrices.reduce<string>((w, [c, p]) => (p > (featured.prices[w] ?? -Infinity) ? c : w), allPrices[0][0])
  const save      = featured.prices[worst] - featured.prices[best]
  const savePct   = Math.round((1 - featured.prices[best] / featured.prices[worst]) * 100)
  const rows      = ["FR", "DE", "ES"].filter((c) => featured.prices[c] != null).map((c) => ({ c, price: featured.prices[c], isBest: c === best, isWorst: c === worst }))
  const bestUrl   = featured.affiliateUrls[best] || featured.affiliateUrl

  return (
    <section id="vedette" className="section featured" data-featured-section>
      <div className="wrap">
        <div className="featured__grid">
          {/* Media: scroll-driven parallax + perspective rotateY */}
          <div className="featured__media" data-featured-media style={{ position: "relative" }}>
            <span className="badge-savings" data-pulse>
              <span className="badge-savings__dot" aria-hidden="true" />
              Meilleur prix · Économisez {formatEURSmart(save)}
            </span>
            <div className="featured__media-inner">
              {featured.image && <Image src={featured.image} alt={featured.title} fill style={{ objectFit: "contain" }} />}
            </div>
            <span className="meta-tag">{featured.brand}</span>
            <span className="featured__corner featured__corner--tl" aria-hidden="true" />
            <span className="featured__corner featured__corner--tr" aria-hidden="true" />
            <span className="featured__corner featured__corner--bl" aria-hidden="true" />
            <span className="featured__corner featured__corner--br" aria-hidden="true" />
          </div>

          {/* Copy */}
          <div className="featured__copy" data-reveal="fade">
            <div className="eyebrow">La sélection ComparEuro</div>
            <h2 className="h-section" style={{ marginTop: 24 }}>
              {featured.title},<br />
              <span className="em-serif" style={{ color: "var(--blue)" }}>{formatEURSmart(save)} moins cher</span>
              <br />ailleurs.
            </h2>
            <p className="sub" style={{ marginTop: 28 }}>{featured.description}</p>

            {/* Split-flap price ticker */}
            <div className="featured__price">
              <span className="now"><PriceRoller value={formatEUR(featured.prices[best])} /></span>
              <span className="was">{formatEUR(featured.prices[worst])}</span>
              <span className="save"><PriceRoller value={`−${savePct} %`} /></span>
            </div>

            <div className="featured__compare">
              {rows.map((r) => (
                <div key={r.c} className={`cmp-row${r.isBest ? " is-best" : ""}${r.isWorst ? " is-worst" : ""}`}>
                  <Flag country={r.c} size={18} />
                  <div className="lab">
                    <b>{COUNTRY_AMAZON[r.c]}</b>
                    <small>{r.isBest ? "Meilleur prix" : r.isWorst ? "Le plus cher" : "Médian"}</small>
                  </div>
                  <span className="px">{formatEUR(r.price)}</span>
                </div>
              ))}
            </div>

            <div className="featured__cta-row">
              <a href={bestUrl} target="_blank" rel="noopener noreferrer" className="btn btn--cta" data-magnetic>
                Acheter sur {COUNTRY_AMAZON[best]}
                <svg className="arr" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Ouvre dans un nouvel onglet">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <a href={`/produit/${featured.slug}`} className="btn btn--ghost" style={{ color: "var(--text-on-dark-mute)" }}>
                Voir la fiche complète →
              </a>
            </div>

            <div className="featured__updated" suppressHydrationWarning>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" />
              </svg>
              Prix mis à jour {featured.updated}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
