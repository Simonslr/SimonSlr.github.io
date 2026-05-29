import Link from "next/link"
import type { Metadata } from "next"
import DesignNavbar from "@/components/DesignNavbar"
import { requestPasswordReset } from "@/app/actions/auth"

export const metadata: Metadata = {
  title: "Mot de passe oublié | EuroCompare",
}

interface Props {
  searchParams: Promise<{ error?: string; sent?: string }>
}

export default async function MotDePasseOubliePage({ searchParams }: Props) {
  const { error, sent } = await searchParams

  if (sent) {
    return (
      <>
        <DesignNavbar />
        <main
          data-hero="dark"
          style={{
            minHeight: "100vh",
            background: "var(--bg-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.25)", display: "grid", placeItems: "center", margin: "0 auto 28px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h1 style={{ ...titleStyle, fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 12, textAlign: "center" }}>
              Email envoyé<span style={{ color: "var(--blue)" }}>.</span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(245,245,247,0.55)", lineHeight: 1.65, maxWidth: 340, margin: "0 auto 32px" }}>
              Si cette adresse est associée à un compte, vous recevrez un lien pour réinitialiser votre mot de passe.
            </p>
            <Link
              href="/connexion"
              style={{ fontSize: 14, color: "rgba(245,245,247,0.45)", textDecoration: "none" }}
            >
              ← Retour à la connexion
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <DesignNavbar />
      <main
        data-hero="dark"
        style={{
          minHeight: "100vh",
          background: "var(--bg-dark)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px 64px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>

          <Link
            href="/connexion"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(245,245,247,0.4)", textDecoration: "none", marginBottom: 32 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Connexion
          </Link>

          <h1 style={titleStyle}>
            Réinitialiser<span style={{ color: "var(--blue)" }}>.</span>
          </h1>
          <p style={subStyle}>
            Entrez votre email — vous recevrez un lien pour choisir un nouveau mot de passe.
          </p>

          {error && (
            <div style={alertErrorStyle}>
              Adresse email invalide.
            </div>
          )}

          <form action={requestPasswordReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" name="email" required
                placeholder="vous@exemple.com"
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              className="btn btn--primary"
              style={{ marginTop: 4, justifyContent: "center", borderRadius: 10, padding: "14px 20px", fontSize: 15, fontWeight: 600 }}
            >
              Envoyer le lien de réinitialisation
            </button>
          </form>

        </div>
      </main>
    </>
  )
}

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-fraunces, serif)",
  fontStyle: "italic",
  fontWeight: 400,
  fontSize: "clamp(44px, 8vw, 64px)",
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color: "#f5f5f7",
  margin: "0 0 10px",
}

const subStyle: React.CSSProperties = {
  fontSize: 15,
  color: "rgba(245,245,247,0.55)",
  marginBottom: 36,
  lineHeight: 1.55,
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(245,245,247,0.65)",
  marginBottom: 7,
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  fontSize: 15,
  outline: "none",
  fontFamily: "inherit",
  color: "#f5f5f7",
  background: "rgba(255,255,255,0.06)",
  boxSizing: "border-box",
}

const alertErrorStyle: React.CSSProperties = {
  background: "rgba(220,38,38,0.10)",
  border: "1px solid rgba(220,38,38,0.22)",
  borderRadius: 10,
  padding: "12px 16px",
  marginBottom: 20,
  fontSize: 14,
  color: "#f87171",
}
