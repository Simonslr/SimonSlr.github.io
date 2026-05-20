import Link from "next/link"
import type { Metadata } from "next"
import DesignNavbar from "@/components/DesignNavbar"
import { signUp } from "@/app/actions/auth"

export const metadata: Metadata = {
  title: "Créer un compte | EuroCompare",
}

interface Props {
  searchParams: Promise<{ error?: string; success?: string }>
}

export default async function InscriptionPage({ searchParams }: Props) {
  const { error, success } = await searchParams

  if (success) {
    return (
      <>
        <DesignNavbar />
        <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 420, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "#eef4ff", display: "grid", placeItems: "center", margin: "0 auto 24px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Vérifiez votre email
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-mute)", lineHeight: 1.65, marginBottom: 28 }}>
              Un lien de confirmation vous a été envoyé. Cliquez dessus pour activer votre compte.
            </p>
            <Link href="/connexion" className="btn btn--primary" style={{ justifyContent: "center" }}>
              Retour à la connexion
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <DesignNavbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 420, padding: "48px 24px" }}>

          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-mute)", marginBottom: 32 }}>
            Gratuit. Aucune carte bancaire requise.
          </p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#dc2626" }}>
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" name="email" required
                placeholder="vous@exemple.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
                Mot de passe
              </label>
              <input
                type="password" name="password" required
                placeholder="Minimum 6 caractères"
                minLength={6}
                style={inputStyle}
              />
            </div>
            <button type="submit" className="btn btn--primary" style={{ marginTop: 4, justifyContent: "center", borderRadius: 10, padding: "13px 20px", fontSize: 15 }}>
              Créer mon compte
            </button>
          </form>

          <p style={{ marginTop: 14, fontSize: 12, color: "var(--text-mute)", lineHeight: 1.6 }}>
            En créant un compte vous acceptez nos{" "}
            <Link href="/mentions-legales" style={{ color: "var(--blue)" }}>mentions légales</Link>.
          </p>

          <p style={{ marginTop: 24, fontSize: 14, color: "var(--text-mute)", textAlign: "center" }}>
            Déjà un compte ?{" "}
            <Link href="/connexion" style={{ color: "var(--blue)", fontWeight: 500 }}>
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 15,
  outline: "none",
  fontFamily: "inherit",
  color: "var(--text)",
  background: "var(--bg)",
  boxSizing: "border-box",
}
