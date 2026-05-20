import Flag from "./Flag"
import { getFeaturedProduct } from "@/lib/design-data"

function fmt(n: number) {
  return n % 1 === 0 ? n.toFixed(0) + " €" : n.toFixed(2) + " €"
}

export default function DesignMethod() {
  const featured = getFeaturedProduct()

  // Vraies données pour la démo step 2 — produit vedette ou valeurs génériques
  const demoName  = featured ? featured.title.split(" ").slice(0, 3).join(" ") : "un produit"
  const demoCount = featured ? "30+" : "..."
  const priceFR   = featured?.prices["FR"] ? fmt(featured.prices["FR"]) : "XX €"
  const priceDE   = featured?.prices["DE"] ? fmt(featured.prices["DE"]) : "XX €"
  const priceES   = featured?.prices["ES"] ? fmt(featured.prices["ES"]) : "XX €"
  const saving    = featured ? `−${fmt(featured.savings)}` : "−XX €"
  const bestAMZ   = featured?.bestCountry === "DE" ? "amazon.de"
    : featured?.bestCountry === "ES" ? "amazon.es"
    : "amazon.fr"

  return (
    <section id="methode" className="section method peel-target" data-pin-section>
      <div className="wrap">
        <div className="method__head">
          <div>
            <h2 className="h-section" data-reveal="fade">
              Comment ça{" "}
              <span className="italic-serif" style={{ color: "var(--blue)" }}>marche.</span>
            </h2>
          </div>
          <p className="sub" data-reveal="fade" style={{ paddingBottom: 8, color: "rgba(245,245,247,0.75)" }}>
            Aucune inscription. Aucune redirection intermédiaire. Vous cliquez,
            vous arrivez sur la fiche Amazon du pays au meilleur prix.
          </p>
        </div>

        <div className="method__steps">
          {/* Étape 01 */}
          <article className="step" data-reveal="card" data-step="1">
            <div>
              <div className="step__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
              </div>
              <div className="step__num">Étape 01</div>
              <h3 className="step__title">
                Cherchez<br /><span className="em-serif">un produit.</span>
              </h3>
              <p className="step__body">
                Tapez un nom, un modèle, ou parcourez la sélection.
                Marques et références identiques aux trois pays.
              </p>
            </div>
            <div className="demo-mini">
              <div className="lin"><span>recherche</span><span className="v">&ldquo;{demoName}&rdquo;</span></div>
              <div className="lin"><span>résultats</span><span className="v">{demoCount}</span></div>
            </div>
          </article>

          {/* Étape 02 — vrais prix */}
          <article className="step" data-reveal="card" data-step="2">
            <div>
              <div className="step__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v18" /><path d="M16 3v18" /><path d="M4 8h4" /><path d="M16 14h4" /><path d="M16 6h4" /><path d="M4 16h4" />
                </svg>
              </div>
              <div className="step__num">Étape 02</div>
              <h3 className="step__title">
                Comparez<br /><span className="em-serif">trois pays.</span>
              </h3>
              <p className="step__body">
                Nous interrogeons Amazon.fr, Amazon.de et Amazon.es,
                puis ajoutons la livraison vers la France.
              </p>
            </div>
            <div className="demo-mini">
              <div className="lin">
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Flag country="FR" size={12} /> Amazon.fr
                </span>
                <span className="v">{priceFR}</span>
              </div>
              <div className="lin">
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Flag country="DE" size={12} /> Amazon.de
                </span>
                <span className={`v${featured?.bestCountry === "DE" ? " win" : ""}`}>{priceDE}</span>
              </div>
              <div className="lin">
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Flag country="ES" size={12} /> Amazon.es
                </span>
                <span className={`v${featured?.bestCountry === "ES" ? " win" : ""}`}>{priceES}</span>
              </div>
            </div>
          </article>

          {/* Étape 03 */}
          <article className="step" data-reveal="card" data-step="3">
            <div>
              <div className="step__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
                </svg>
              </div>
              <div className="step__num">Étape 03</div>
              <h3 className="step__title">
                Achetez<br /><span className="em-serif">directement.</span>
              </h3>
              <p className="step__body">
                Un seul clic vous emmène sur la fiche Amazon du meilleur
                pays. Pas d&apos;intermédiaire, pas de surcoût.
              </p>
            </div>
            <div className="demo-mini">
              <div className="lin"><span>destination</span><span className="v">{bestAMZ}</span></div>
              <div className="lin"><span>économie</span><span className="v win">{saving}</span></div>
            </div>
          </article>
        </div>

        <div className="method__progress" id="method-progress" aria-hidden="true" />
      </div>
    </section>
  )
}
