// EuroPrix — Featured product (AirPods Pro 2)
const Featured = () => {
  const { featured } = window.EUROPRIX_DATA;
  const best = featured.bestCountry;
  const worst = Object.entries(featured.prices).reduce((w, [c, p]) => p > w[1] ? [c, p] : w, ["FR", -Infinity])[0];
  const save = featured.prices[worst] - featured.prices[best];

  const rows = ["FR", "DE", "ES"].map((c) => ({
    c,
    price: featured.prices[c],
    best: c === best,
    worst: c === worst,
  }));

  return (
    <section id="vedette" className="section featured" data-featured-section>
      <div className="wrap">
        <div className="featured__grid">
          <div className="featured__media" data-featured-media>
            <span className="badge-savings">Économisez {window.formatEURSmart(save)}</span>
            <image-slot
              id="featured-airpods"
              placeholder="Photo AirPods Pro 2 — fond sombre"
              shape="rect"
            ></image-slot>
            <span className="meta-tag">AirPods Pro · 2024</span>
          </div>

          <div className="featured__copy" data-reveal="fade">
            <div className="eyebrow">La sélection EuroPrix</div>

            <h2 className="h-section" style={{ marginTop: 24 }}>
              AirPods Pro 2,<br /><span className="em-serif" style={{ color: "var(--blue)" }}>59 € moins cher</span>
              <br /> à Berlin.
            </h2>

            <p className="sub" style={{ marginTop: 28 }}>
              Modèle USB-C neuf, vendu et expédié par Amazon.de.
              Livraison sous 2&ndash;4 jours vers la France, incluse dans le prix
              affiché. Garantie européenne 2 ans.
            </p>

            <div className="featured__price">
              <span className="now">{window.formatEUR(featured.prices[best], 2)}</span>
              <span className="was">{window.formatEUR(featured.prices[worst], 2)}</span>
              <span className="save">−{Math.round((1 - featured.prices[best] / featured.prices[worst]) * 100)}&nbsp;%</span>
            </div>

            <div className="featured__compare">
              {rows.map((r) => (
                <div key={r.c} className={`cmp-row ${r.best ? "is-best" : ""} ${r.worst ? "is-worst" : ""}`}>
                  <window.Flag country={r.c} className="flag flag-lg" />
                  <div className="lab">
                    <b>{window.COUNTRY_AMAZON[r.c]}</b>
                    <small>{r.best ? "Meilleur prix" : r.worst ? "Le plus cher" : "Médian"}</small>
                  </div>
                  <span className="px">{window.formatEUR(r.price, 2)}</span>
                </div>
              ))}
            </div>

            <div className="featured__cta-row">
              <a className="btn btn--cta" href="#">
                Acheter sur Amazon.de
                <window.Icon.ArrowUpRight className="arr" />
              </a>
              <a className="btn btn--ghost" href="#" style={{ color: "var(--text-on-dark-mute)" }}>
                Voir la fiche complète →
              </a>
            </div>

            <div className="featured__updated">
              <window.Icon.Refresh />
              Prix mis à jour il y a {featured.updatedMinutesAgo} minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

window.Featured = Featured;
