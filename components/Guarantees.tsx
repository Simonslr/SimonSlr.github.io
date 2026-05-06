const ITEMS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"/>
      </svg>
    ),
    title: "Vendeurs officiels uniquement",
    desc: "Pas de marketplace tiers. Uniquement Amazon et marques officielles avec garantie constructeur.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>
      </svg>
    ),
    title: "Livraison incluse dans le prix",
    desc: "Le prix affiché est le prix final livré chez vous, après application de tous les frais de port.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-3.5-7.1"/><path d="M21 4v5h-5"/>
      </svg>
    ),
    title: "Données régulièrement mises à jour",
    desc: "Les prix sont vérifiés plusieurs fois par jour. Un horodatage indique la dernière mise à jour.",
  },
]

export default function Guarantees() {
  return (
    <section style={{ padding: "120px 56px", background: "#fff", borderTop: "1px solid #E2E8F0" }}>
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-16">
          <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 font-mono mb-4">
            Nos engagements
          </div>
          <h2 className="font-black text-slate-900 m-0" style={{ fontSize: 52, letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            Une comparaison sans piège.
          </h2>
        </div>

        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          {ITEMS.map(item => (
            <div key={item.title}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-indigo-600"
                style={{ background: "#EEF2FF" }}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-xl tracking-tight m-0 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed m-0">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
