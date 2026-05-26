"use client"

export default function DesignTrust() {
  return (
    <section id="confiance" className="section trust" data-trust-sec>
      <div className="trust__bg" aria-hidden="true" />
      <div className="wrap">
        <div className="trust__head">
          <div className="eyebrow" data-reveal="fade">Trois engagements</div>
          <h2 className="h-section" style={{ marginTop: 24 }} data-reveal="fade">
            Ce que nous<br />
            <span className="em-serif" style={{ color: "var(--blue)" }}>promettons.</span>
          </h2>
        </div>

        <div className="trust__list">
          <Pledge
            ordinal="1"
            num="100%"
            title={<>Livraison<br /><span className="em-serif">incluse</span>, toujours.</>}
            body="Le prix que vous voyez est le prix que vous payez à l'arrivée : produit + livraison vers la France, sans frais cachés."
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 17H4V6h11v11Z" /><path d="M14 9h4l3 3v5h-7" /><circle cx="8" cy="17.5" r="1.6" /><circle cx="18" cy="17.5" r="1.6" /></svg>}
          />
          <Pledge
            ordinal="2"
            num="3/3"
            title={<>Vendeurs officiels<br /><span className="em-serif">uniquement.</span></>}
            body="Seules les offres expédiées par Amazon ou par des marchands vérifiés apparaissent. Pas de marketplace tierce douteuse."
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>}
          />
          <Pledge
            ordinal="3"
            num="0 €"
            title={<>Lien direct,<br /><span className="em-serif">zéro intermédiaire.</span></>}
            body="Un seul clic vous emmène sur Amazon. Pas de redirection, pas de page intermédiaire, pas de mauvaise surprise."
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></svg>}
          />
        </div>
      </div>
    </section>
  )
}

function Pledge({ ordinal, num, title, body, icon }: { ordinal: string; num: string; title: React.ReactNode; body: string; icon: React.ReactNode }) {
  return (
    <article className="pledge2" data-reveal="card">
      <div className="pledge2__ghost" aria-hidden="true">{ordinal}</div>
      <div className="pledge2__num" aria-hidden="true">{num}</div>
      <div className="pledge2__body">
        <div className="pledge2__icon">{icon}</div>
        <h3 className="pledge2__title">{title}</h3>
        <p className="pledge2__copy">{body}</p>
      </div>
      <div className="pledge2__line" data-trust-line aria-hidden="true" />
    </article>
  )
}
