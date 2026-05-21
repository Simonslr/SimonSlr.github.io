// EuroPrix — final CTA + footer
const CTAFinal = () => (
  <section className="section cta-fin">
    <div className="wrap">
      <div className="cta-fin__inner">
        <h2 data-reveal="fade">
          <span className="reveal-line"><span>Le même produit.</span></span>
          <span className="reveal-line"><span><span className="em-serif">Moins cher.</span> Maintenant.</span></span>
        </h2>
        <p className="cta-fin__sub" data-reveal="fade">
          Aucune inscription. Vous comparez, vous cliquez, vous achetez sur Amazon.
          La seule chose qui change, c'est le prix.
        </p>
        <div className="cta-fin__btns" data-reveal="fade">
          <a className="btn btn--primary" href="#catalogue">
            Voir les économies du jour
            <window.Icon.ArrowRight />
          </a>
          <a className="btn btn--outline" href="#methode">
            Comment ça marche
          </a>
        </div>
        <div className="cta-fin__chips" data-reveal="fade">
          <span>Prix livraison incluse</span>
          <span>Vendeurs officiels</span>
          <span>Sans inscription</span>
          <span>Lien direct Amazon</span>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="foot">
    <div className="wrap">
      <div className="foot__top">
        <div className="foot__brand">
          <a className="nav__logo" href="#top">
            <span className="mark">€</span>
            <span>EuroPrix</span>
          </a>
          <p>Comparateur Amazon France · Allemagne · Espagne.
            Conçu à Paris. Indépendant.</p>
        </div>

        <div className="foot__col">
          <h4>Produit</h4>
          <ul>
            <li><a href="#methode">Comment ça marche</a></li>
            <li><a href="#comparateur">Comparateur</a></li>
            <li><a href="#catalogue">Catalogue</a></li>
            <li><a href="#confiance">Confiance</a></li>
          </ul>
        </div>

        <div className="foot__col">
          <h4>Catégories</h4>
          <ul>
            <li><a href="#">Audio</a></li>
            <li><a href="#">Smartphones</a></li>
            <li><a href="#">Informatique</a></li>
            <li><a href="#">Gaming</a></li>
            <li><a href="#">Maison</a></li>
          </ul>
        </div>

        <div className="foot__col">
          <h4>Légal</h4>
          <ul>
            <li><a href="#">Mentions légales</a></li>
            <li><a href="#">Affiliation Amazon</a></li>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="foot__bottom">
        <span>© 2026 EuroPrix · Tous droits réservés.</span>
        <span className="right">
          <span>FR · DE · ES</span>
          <span>Programme d'affiliation Amazon</span>
        </span>
      </div>
    </div>
  </footer>
);

Object.assign(window, { CTAFinal, Footer });
