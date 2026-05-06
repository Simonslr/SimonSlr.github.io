const STEPS = [
  {
    n: "01",
    title: "Cherchez un produit",
    desc: "Tapez le nom d'un produit dans la barre de recherche en haut de page.",
    iconColor: "#4F46E5",
    iconBg: "#EEF2FF",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
      </svg>
    ),
  },
  {
    n: "02",
    title: "On compare les 3 pays",
    desc: "On calcule le prix total livraison incluse chez les vendeurs officiels.",
    iconColor: "#7C3AED",
    iconBg: "#F5F3FF",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19V11M12 19V5M19 19v-6"/>
      </svg>
    ),
  },
  {
    n: "03",
    title: "Achetez moins cher",
    desc: "Suivez le lien direct et économisez immédiatement sur votre commande.",
    iconColor: "#059669",
    iconBg: "#ECFDF5",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 5a8 8 0 1 0 0 14"/><path d="M3 10h11M3 14h11"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "120px 56px", background: "#F8FAFC" }}>
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-16">
          <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 font-mono mb-4">
            Comment ça marche
          </div>
          <h2 className="font-black text-slate-900 m-0" style={{ fontSize: 52, letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            Trois étapes, zéro friction.
          </h2>
          <p className="text-lg text-slate-500 mt-4 leading-relaxed max-w-2xl">
            Pas d'inscription, pas de carte bleue, pas de cookies tiers. Vous cherchez, on compare, vous économisez.
          </p>
        </div>

        <div
          className="grid items-center"
          style={{ gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 0 }}
        >
          {STEPS.map((s, i) => (
            <div key={s.n} className="contents">
              <div
                className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between"
                style={{ padding: 32, minHeight: 280 }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: s.iconBg, color: s.iconColor }}
                    >
                      {s.icon}
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-lg font-mono font-bold text-xs tracking-widest"
                      style={{ background: s.iconBg, color: s.iconColor }}
                    >
                      {s.n}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl tracking-tight m-0 mb-3">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed m-0">{s.desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="px-3 flex items-center justify-center">
                  <svg width="64" height="20" viewBox="0 0 64 20" fill="none">
                    <path d="M2 10 H58" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 4" />
                    <path d="M52 4 L60 10 L52 16" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
