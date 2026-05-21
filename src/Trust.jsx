// EuroPrix — Trust pledges
const Trust = () => (
  <section id="confiance" className="section trust">
    <div className="wrap">
      <div className="trust__head">
        <div className="eyebrow" data-reveal="fade">Trois engagements</div>
        <h2 className="h-section" style={{ marginTop: 24 }} data-reveal="fade">
          Ce que nous<br /><span className="em-serif" style={{ color: "var(--blue)" }}>promettons.</span>
        </h2>
      </div>

      <div className="trust__grid">
        <article className="pledge" data-reveal="card">
          <div className="pledge__icon"><window.Icon.Truck /></div>
          <div>
            <div className="pledge__num">N°01</div>
            <h3 className="pledge__title">
              Livraison<br /><span className="em-serif">incluse</span>, toujours.
            </h3>
            <p className="pledge__body">
              Le prix que vous voyez est le prix que vous payez à l'arrivée :
              produit + livraison vers la France, sans frais cachés.
            </p>
          </div>
        </article>

        <article className="pledge" data-reveal="card">
          <div className="pledge__icon"><window.Icon.Shield /></div>
          <div>
            <div className="pledge__num">N°02</div>
            <h3 className="pledge__title">
              Vendeurs officiels<br /><span className="em-serif">uniquement.</span>
            </h3>
            <p className="pledge__body">
              Seules les offres expédiées par Amazon ou par des marchands
              vérifiés apparaissent. Pas de marketplace tierce douteuse.
            </p>
          </div>
        </article>

        <article className="pledge" data-reveal="card">
          <div className="pledge__icon"><window.Icon.Globe /></div>
          <div>
            <div className="pledge__num">N°03</div>
            <h3 className="pledge__title">
              Lien direct,<br /><span className="em-serif">zéro intermédiaire.</span>
            </h3>
            <p className="pledge__body">
              Un seul clic vous emmène sur Amazon. Pas de redirection,
              pas de page intermédiaire, pas de mauvaise surprise.
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
);

window.Trust = Trust;
