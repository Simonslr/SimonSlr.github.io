// EuroPrix — Navbar
const Navbar = ({ isDark, scrolled }) => {
  return (
    <nav className={`nav ${isDark ? "is-dark" : ""} ${scrolled ? "is-scrolled" : ""}`}>
      <div className="wrap nav__inner">
        <a className="nav__logo" href="#top">
          <span className="mark">€</span>
          <span>EuroPrix</span>
        </a>
        <div className="nav__links">
          <a href="#methode">Comment ça marche</a>
          <a href="#vedette">Sélection</a>
          <a href="#catalogue">Catalogue</a>
          <a href="#confiance">Confiance</a>
        </div>
        <div className="nav__right">
          <button className="btn btn--ghost" type="button" aria-label="Recherche">
            <window.Icon.Search width="16" height="16" />
          </button>
          <button className="btn btn--primary" type="button">
            Comparer un produit
            <window.Icon.ArrowRight />
          </button>
        </div>
      </div>
    </nav>
  );
};

window.Navbar = Navbar;
