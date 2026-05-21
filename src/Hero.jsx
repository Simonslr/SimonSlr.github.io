// EuroPrix — Hero (2 variants: dark monumental, light editorial)
const { useState } = React;

const HeroTicker = () => {
  const { featured } = window.EUROPRIX_DATA;
  const rows = [
    { c: "FR", price: featured.prices.FR, delta: "+8 €", up: true },
    { c: "DE", price: featured.prices.DE, delta: "−59 €", best: true },
    { c: "ES", price: featured.prices.ES, delta: "stable", mute: true },
  ];
  return (
    <aside className="hero__ticker" data-reveal="fade">
      <div className="hero__ticker-head">
        <span className="hero__ticker-title">AirPods Pro 2 · USB-C</span>
        <span className="live-pill"><span className="ld" />En direct</span>
      </div>
      {rows.map((r) => (
        <div className={`tk-row ${r.best ? "is-best" : ""}`} key={r.c}>
          <span className="tk-flag"><window.Flag country={r.c} className="flag" /></span>
          <span className="tk-country">{window.COUNTRY_AMAZON[r.c]}</span>
          <span className={`tk-price ${r.best ? "tk-best" : ""}`}>{window.formatEURSmart(r.price)}</span>
          <span className={`tk-delta ${r.up ? "tk-delta--neg" : ""} ${r.mute ? "tk-delta--mute" : ""}`}>
            {r.delta}
          </span>
        </div>
      ))}
    </aside>
  );
};

const HeroStats = () => (
  <div className="hero__stats">
    <div data-reveal="fade">
      <div className="stat__num">
        <span className="em">28&nbsp;%</span>
      </div>
      <div className="stat__lab">d'écart moyen entre pays<span className="demo-label">démo</span></div>
    </div>
    <div data-reveal="fade">
      <div className="stat__num mono">31&nbsp;284</div>
      <div className="stat__lab">comparaisons ce mois<span className="demo-label">démo</span></div>
    </div>
    <div data-reveal="fade">
      <div className="stat__num">
        <span className="em">3</span>
        <span style={{ opacity: 0.5 }}> / 3</span>
      </div>
      <div className="stat__lab">marketplaces officielles</div>
    </div>
  </div>
);

// ---- VARIANT A — dark monumental ----
const HeroDark = () => (
  <section id="top" className="hero" data-hero="dark">
    <div className="hero__bg" aria-hidden="true" />
    <div className="wrap hero__inner">
      <div>
        <div className="eyebrow" data-reveal="fade">
          Comparateur Amazon · FR · DE · ES
        </div>

        <h1 className="hero__title" style={{ marginTop: 32 }}>
          <span className="reveal-line"><span>Le même produit.</span></span>
          <span className="reveal-line"><span><i className="word-italic">Moins cher</i> ailleurs</span></span>
          <span className="reveal-line"><span>en <span className="word-accent">Europe.</span></span></span>
        </h1>

        <p className="hero__sub" data-reveal="fade">
          EuroPrix scanne Amazon en France, en Allemagne et en Espagne — livraison
          incluse, vendeurs officiels uniquement, sans inscription.
        </p>

        <div className="hero__cta-row" data-reveal="fade">
          <a className="btn btn--primary" href="#catalogue">
            Voir les économies du jour
            <window.Icon.ArrowRight />
          </a>
          <a className="btn btn--ghost" href="#methode">
            Comment ça marche
          </a>
        </div>

        <div className="hero__trustline" data-reveal="fade">
          <span><span className="dot" /> Prix livraison incluse</span>
          <span>Vendeurs officiels</span>
          <span>Sans inscription</span>
        </div>
      </div>

      <HeroTicker />
    </div>

    <div className="wrap"><HeroStats /></div>
  </section>
);

// ---- VARIANT B — light editorial ----
const HeroEditorial = () => (
  <section id="top" className="hero hero--editorial" data-hero="light">
    <div className="hero__bg" aria-hidden="true" />
    <div className="wrap hero__inner">
      <div>
        <div className="eyebrow" data-reveal="fade">
          Comparateur Amazon · FR · DE · ES
        </div>

        <h1 className="hero__title" style={{ marginTop: 32 }}>
          <span className="reveal-line"><span>Acheter <i className="word-italic">le même</i></span></span>
          <span className="reveal-line"><span>produit, payé</span></span>
          <span className="reveal-line"><span><span className="word-accent">moins cher.</span></span></span>
        </h1>

        <p className="hero__sub" data-reveal="fade">
          Trois marketplaces. Une seule devise. Nous comparons Amazon.fr,
          Amazon.de et Amazon.es en temps réel — pour que vous voyiez
          la vraie économie, livraison incluse.
        </p>

        <div className="hero__cta-row" data-reveal="fade">
          <a className="btn btn--primary" href="#catalogue">
            Voir les économies du jour
            <window.Icon.ArrowRight />
          </a>
          <a className="btn btn--ghost" href="#methode">
            Comment ça marche →
          </a>
        </div>

        <div className="hero__trustline" data-reveal="fade">
          <span><span className="dot" /> Prix livraison incluse</span>
          <span>Vendeurs officiels</span>
          <span>Sans inscription</span>
        </div>
      </div>

      <HeroTicker />
    </div>

    <div className="wrap"><HeroStats /></div>
  </section>
);

const Hero = ({ variant }) => variant === "editorial" ? <HeroEditorial /> : <HeroDark />;

const VariantSwitch = ({ variant, setVariant }) => (
  <div className="variant-switch" role="tablist" aria-label="Variante du hero">
    <button className={variant === "dark" ? "on" : ""} onClick={() => setVariant("dark")} role="tab">A · Sombre</button>
    <button className={variant === "editorial" ? "on" : ""} onClick={() => setVariant("editorial")} role="tab">B · Éditorial</button>
  </div>
);

Object.assign(window, { Hero, HeroDark, HeroEditorial, VariantSwitch });
