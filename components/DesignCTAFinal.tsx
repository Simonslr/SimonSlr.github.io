"use client"

import EuroCompareLogo from "./EuroCompareLogo"
import Link from "next/link"

export default function DesignCTAFinal() {
  const handleScrollToCatalogue = () => {
    const el = document.getElementById("catalogue")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <section className="section cta-fin" data-cta-final>
        <div className="cta-fin__bg" aria-hidden="true" />
        <div className="wrap">
          <div className="cta-fin__rule" data-extend-x aria-hidden="true" />

          <div className="cta-fin__eyebrow" data-reveal="fade">
            <span className="eyebrow">Le bon prix, où qu&apos;il soit</span>
          </div>

          <div className="cta-fin__inner">
            <h2 className="cta-fin__title">
              <span className="curtain-line" data-curtain-up data-split-chars><span>Le même produit.</span></span>
              <span className="curtain-line" data-curtain-up data-split-chars>
                <span><span className="em-serif">Moins cher.</span> Maintenant.</span>
              </span>
            </h2>

            <p className="cta-fin__sub" data-reveal="fade">
              Aucune inscription. Vous comparez, vous cliquez, vous achetez sur Amazon.
              La seule chose qui change, c&apos;est le prix.
            </p>

            <div className="cta-fin__btns" data-reveal="fade">
              <button className="btn btn--primary btn--xl" onClick={handleScrollToCatalogue} type="button" data-magnetic>
                Voir les économies du jour
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              <a className="btn btn--outline" href="/#methode">Comment ça marche</a>
            </div>

            <div className="cta-fin__chips" data-reveal="fade">
              <span>Prix livraison incluse</span>
              <span>Vendeurs officiels</span>
              <span>Sans inscription</span>
              <span>Lien direct Amazon</span>
            </div>
          </div>

          <div className="cta-fin__rule cta-fin__rule--bot" data-extend-x aria-hidden="true" />
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="foot__top">
            <div className="foot__brand">
              <a className="nav__logo" href="/" style={{ gap: 8 }}>
                <EuroCompareLogo size={22} color="rgba(255,255,255,0.9)" textColor="rgba(255,255,255,0.9)" showText={false} />
                <span>EuroCompare</span>
              </a>
              <p>Comparateur Amazon France · Allemagne · Espagne. Conçu à Paris. Indépendant.</p>
            </div>
            <div className="foot__col">
              <h4>Produit</h4>
              <ul>
                <li><Link href="/#methode">Comment ça marche</Link></li>
                <li><Link href="/#comparateur">Comparateur</Link></li>
                <li><Link href="/#catalogue">Catalogue</Link></li>
                <li><Link href="/#confiance">Confiance</Link></li>
              </ul>
            </div>
            <div className="foot__col">
              <h4>Catégories</h4>
              <ul>
                <li><Link href="/#catalogue">Audio</Link></li>
                <li><Link href="/#catalogue">Smartphones</Link></li>
                <li><Link href="/#catalogue">Informatique</Link></li>
                <li><Link href="/#catalogue">Gaming</Link></li>
                <li><Link href="/#catalogue">Maison</Link></li>
              </ul>
            </div>
            <div className="foot__col">
              <h4>Légal</h4>
              <ul>
                <li><Link href="/mentions-legales">Mentions légales</Link></li>
                <li><Link href="/mentions-legales">Affiliation Amazon</Link></li>
                <li><Link href="/confidentialite">Cookies</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="foot__bottom">
            <span>© 2026 EuroCompare · Tous droits réservés.</span>
            <span className="right">
              <span>FR · DE · ES</span>
              <span>Programme d&apos;affiliation Amazon</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
