import Link from "next/link"
import type { Metadata } from "next"
import DesignNavbar from "@/components/DesignNavbar"

export const metadata: Metadata = {
  title: "Page introuvable | ComparEuro",
}

export default function NotFound() {
  return (
    <>
      <DesignNavbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-mute)",
            marginBottom: 24,
          }}>
            Erreur 404
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(48px, 8vw, 96px)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: "var(--text)",
            marginBottom: 24,
          }}>
            Page introuvable.
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-mute)", marginBottom: 40, maxWidth: "42ch", margin: "0 auto 40px" }}>
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn btn--primary">
              Retour à l&apos;accueil
            </Link>
            <Link href="/#catalogue" className="btn btn--ghost">
              Voir le catalogue
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
