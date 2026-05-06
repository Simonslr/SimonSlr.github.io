import Link from "next/link"

interface Section {
  title: string
  content: React.ReactNode
}

export default function InfoPageLayout({
  title,
  subtitle,
  updatedAt,
  sections,
}: {
  title: string
  subtitle?: string
  updatedAt?: string
  sections: Section[]
}) {
  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "48px 56px 40px" }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors no-underline mb-6"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            Retour à l'accueil
          </Link>
          <h1 className="font-black text-slate-900 m-0" style={{ fontSize: 44, letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-500 mt-3 leading-relaxed">{subtitle}</p>
          )}
          {updatedAt && (
            <p className="text-xs text-slate-400 mt-4 font-mono tracking-wider">
              Dernière mise à jour : {updatedAt}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "56px 56px 96px" }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-12">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="font-bold text-slate-900 mb-3" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>
                  {s.title}
                </h2>
                <div className="text-slate-600 leading-relaxed text-sm space-y-3">
                  {s.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
