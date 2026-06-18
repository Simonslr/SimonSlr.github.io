import CompareUroLogo from "./CompareUroLogo"
import ScrollToCatalogueButton from "./ScrollToCatalogueButton"
import Link from "next/link"

export default function DesignCTAFinal() {
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
              <ScrollToCatalogueButton />
              <Link className="btn btn--outline" href="/#methode">Comment ça marche</Link>
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
              <Link className="nav__logo" href="/" style={{ gap: 8 }}>
                <CompareUroLogo size={22} color="rgba(255,255,255,0.9)" textColor="rgba(255,255,255,0.9)" showText={false} />
                <span>ComparEuro</span>
              </Link>
              <p>Comparateur Amazon France · Allemagne · Espagne. Conçu à Paris. Indépendant.</p>
            </div>
            <div className="foot__col">
              <p className="foot__col-title">Produit</p>
              <ul>
                <li><Link href="/#methode">Comment ça marche</Link></li>
                <li><Link href="/#comparateur">Comparateur</Link></li>
                <li><Link href="/#catalogue">Catalogue</Link></li>
                <li><Link href="/#confiance">Confiance</Link></li>
              </ul>
            </div>
            <div className="foot__col">
              <p className="foot__col-title">Catégories</p>
              <ul>
                <li><Link href="/#catalogue">Audio</Link></li>
                <li><Link href="/#catalogue">Smartphones</Link></li>
                <li><Link href="/#catalogue">Informatique</Link></li>
                <li><Link href="/#catalogue">Gaming</Link></li>
                <li><Link href="/#catalogue">Maison</Link></li>
              </ul>
            </div>
            <div className="foot__col">
              <p className="foot__col-title">Légal</p>
              <ul>
                <li><Link href="/mentions-legales">Mentions légales</Link></li>
                <li><Link href="/cgu">CGU</Link></li>
                <li><Link href="/affiliation">Affiliation Amazon</Link></li>
                <li><Link href="/confidentialite">Confidentialité</Link></li>
                <li><Link href="/cookies">Cookies</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="foot__bottom">
            <span>© 2026 ComparEuro · Tous droits réservés.</span>
            <span className="right">
              <span>FR · DE · ES</span>
              <Link href="/affiliation" style={{ fontSize: 12, textDecoration: "underline", textDecorationColor: "transparent" }}>
                Ce site contient des liens d&apos;affiliation Amazon
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
