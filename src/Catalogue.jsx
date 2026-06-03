// EuroPrix — Comparateur (search) + Catalogue
const { useState: useStateCat, useMemo, useEffect } = React;

const SORTS = [
  { id: "savings", label: "Économie max" },
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
];
const COUNTRY_FILTERS = [
  { id: "all", label: "Tous pays" },
  { id: "DE", label: "Allemagne" },
  { id: "FR", label: "France" },
  { id: "ES", label: "Espagne" },
];

const Catalogue = () => {
  const items = window.EUROCOMP_DATA.catalogue;
  const [query, setQuery] = useStateCat("");
  const [sort, setSort] = useStateCat("savings");
  const [country, setCountry] = useStateCat("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = items.filter((p) => {
      const inQ = !q || (p.title + " " + p.brand).toLowerCase().includes(q);
      const inC = country === "all" || p.bestCountry === country;
      return inQ && inC;
    });
    r = [...r].sort((a, b) => {
      if (sort === "savings") return window.savings(b.prices) - window.savings(a.prices);
      if (sort === "price-asc") return window.priceMin(a.prices) - window.priceMin(b.prices);
      if (sort === "price-desc") return window.priceMin(b.prices) - window.priceMin(a.prices);
      return 0;
    });
    return r;
  }, [items, query, sort, country]);

  return (
    <React.Fragment>
      {/* ========== SEARCH SECTION (white) ========== */}
      <section id="comparateur" className="section search-sec">
        <div className="wrap">
          <div className="search-sec__head">
            <div className="eyebrow" data-reveal="fade">Comparateur · Temps réel</div>
            <h2 className="h-section" style={{ marginTop: 24 }} data-reveal="fade">
              Quel produit<br />
              cherchez-<span className="em-serif" style={{ color: "var(--blue)" }}>vous ?</span>
            </h2>
            <p className="sub" style={{ marginTop: 24 }} data-reveal="fade">
              Tapez le nom d'un produit. Nous trouvons immédiatement la
              meilleure offre Amazon parmi la France, l'Allemagne et l'Espagne.
            </p>
          </div>

          <div className="search-box" data-reveal="fade">
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 14 }}>
              <window.Icon.Search />
              <input
                type="text"
                placeholder="ex. AirPods Pro, Switch OLED, Galaxy S24…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Rechercher un produit"
              />
            </div>
            <button className="btn btn--primary" type="button">
              Comparer
              <window.Icon.ArrowRight />
            </button>
          </div>

          <div className="filters" data-reveal="fade">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-mute)", marginRight: 6 }}>
              Trier
            </span>
            {SORTS.map((s) => (
              <button key={s.id} type="button"
                className={`chip ${sort === s.id ? "on" : ""}`}
                onClick={() => setSort(s.id)}>
                {s.label}
              </button>
            ))}
            <span className="chip-sep" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-mute)", marginRight: 6 }}>
              Meilleur prix
            </span>
            {COUNTRY_FILTERS.map((f) => (
              <button key={f.id} type="button"
                className={`chip ${country === f.id ? "on" : ""}`}
                onClick={() => setCountry(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATALOGUE (soft) ========== */}
      <section id="catalogue" className="section cat">
        <div className="wrap">
          <div className="cat__head">
            <div>
              <div className="eyebrow" data-reveal="fade">Catalogue · Mis à jour ce matin</div>
              <h2 className="h-section" style={{ marginTop: 24 }} data-reveal="fade">
                Les meilleures<br />
                <span className="em-serif" style={{ color: "var(--blue)" }}>économies</span> du jour.
              </h2>
            </div>
            <div className="cat__count" data-reveal="fade">
              {filtered.length} produit{filtered.length > 1 ? "s" : ""} · livraison incluse
            </div>
          </div>

          <div className="cat__grid">
            {filtered.length === 0 && (
              <div className="cat__empty">
                Aucun produit ne correspond à ces filtres.
              </div>
            )}
            {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

const ProductCard = ({ p }) => {
  const best = p.bestCountry;
  const save = window.savings(p.prices);
  const rows = ["FR", "DE", "ES"].map((c) => ({
    c, price: p.prices[c], best: c === best,
  }));

  return (
    <article className="card" data-reveal="card">
      <div className="card__media">
        <span className="card__savings">−{window.formatEURSmart(save)}</span>
        <span className="card__flag-best">
          <window.Flag country={best} className="flag flag-sm" />
          MIN
        </span>
        <image-slot
          id={`cat-${p.id}`}
          placeholder={p.placeholder}
          shape="rect"
        ></image-slot>
      </div>
      <div className="card__body">
        <div>
          <div className="card__brand">{p.brand}</div>
          <div className="card__title" style={{ marginTop: 4 }}>{p.title}</div>
        </div>
        <div className="card__prices">
          {rows.map((r) => (
            <div key={r.c} className={`card__price-row ${r.best ? "best" : ""}`}>
              <window.Flag country={r.c} className="flag flag-sm" />
              <span className="cn">{window.COUNTRY_AMAZON[r.c]}</span>
              <span />
              <span className="pr">{window.formatEURSmart(r.price)}</span>
            </div>
          ))}
        </div>
        <a className="card__cta" href="#">
          Acheter sur {window.COUNTRY_AMAZON[best]}
          <window.Icon.ArrowUpRight />
        </a>
        <div className="card__updated">
          <window.Icon.Refresh /> {p.updated}
        </div>
      </div>
    </article>
  );
};

Object.assign(window, { Catalogue, ProductCard });
