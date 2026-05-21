// EuroPrix — "Comment ça marche" — pinned section
const Method = () => {
  return (
    <section id="methode" className="section method" data-pin-section>
      <div className="wrap">
        <div className="method__head">
          <div>
            <div className="eyebrow" data-reveal="fade">Méthode · 03 étapes</div>
            <h2 className="h-section" style={{ marginTop: 28 }} data-reveal="fade">
              Comment ça <span className="italic-serif" style={{ color: "var(--blue)" }}>marche.</span>
            </h2>
          </div>
          <p className="sub" data-reveal="fade" style={{ paddingBottom: 8 }}>
            Aucune inscription. Aucune redirection intermédiaire. Vous cliquez,
            vous arrivez sur la fiche Amazon du pays au meilleur prix.
          </p>
        </div>

        <div className="method__steps">
          <article className="step" data-reveal="card" data-step="1">
            <div>
              <div className="step__icon"><window.Icon.Search /></div>
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
              <div className="lin"><span>recherche</span><span className="v">"airpods pro 2"</span></div>
              <div className="lin"><span>résultats</span><span className="v">17</span></div>
            </div>
          </article>

          <article className="step" data-reveal="card" data-step="2">
            <div>
              <div className="step__icon"><window.Icon.Compare /></div>
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
              <div className="lin"><span><window.Flag country="FR" className="flag flag-sm" /> Amazon.fr</span><span className="v">279,00 €</span></div>
              <div className="lin"><span><window.Flag country="DE" className="flag flag-sm" /> Amazon.de</span><span className="v win">219,90 €</span></div>
              <div className="lin"><span><window.Flag country="ES" className="flag flag-sm" /> Amazon.es</span><span className="v">239,00 €</span></div>
            </div>
          </article>

          <article className="step" data-reveal="card" data-step="3">
            <div>
              <div className="step__icon"><window.Icon.Bolt /></div>
              <div className="step__num">Étape 03</div>
              <h3 className="step__title">
                Achetez<br /><span className="em-serif">directement.</span>
              </h3>
              <p className="step__body">
                Un seul clic vous emmène sur la fiche Amazon du meilleur
                pays. Pas d'intermédiaire, pas de surcoût.
              </p>
            </div>
            <div className="demo-mini">
              <div className="lin"><span>destination</span><span className="v">amazon.de</span></div>
              <div className="lin"><span>économie</span><span className="v win">−59,10 €</span></div>
            </div>
          </article>
        </div>

        <div className="method__progress" id="method-progress" aria-hidden="true" />
      </div>
    </section>
  );
};

window.Method = Method;
