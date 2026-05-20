import Link from "next/link"
import DesignNavbar from "./DesignNavbar"

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
  title:      string
  subtitle?:  string
  updatedAt?: string
  sections:   Section[]
}) {
  return (
    <>
      <DesignNavbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--bg)" }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 40, marginBottom: 0 }}>
          <div className="wrap" style={{ paddingTop: 48 }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--text-mute)",
                textDecoration: "none",
                marginBottom: 28,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Accueil
            </Link>

            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 68px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--text)",
              marginBottom: subtitle ? 16 : 0,
            }}>
              {title}.
            </h1>

            {subtitle && (
              <p style={{ fontSize: 18, color: "var(--text-mute)", lineHeight: 1.55, maxWidth: "56ch" }}>
                {subtitle}
              </p>
            )}

            {updatedAt && (
              <p style={{
                marginTop: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-mute)",
              }}>
                Mis à jour le {updatedAt}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="wrap" style={{ paddingTop: 64, paddingBottom: 100 }}>
          <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 48 }}>
            {sections.map((s, i) => (
              <section key={i}>
                <h2 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  color: "var(--text)",
                  marginBottom: 14,
                }}>
                  {s.title}
                </h2>
                <div style={{
                  fontSize: 16,
                  color: "var(--text-mute)",
                  lineHeight: 1.75,
                }}>
                  {s.content}
                </div>
              </section>
            ))}
          </div>
        </div>

      </main>
    </>
  )
}
