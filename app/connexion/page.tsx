import Link from "next/link"
import type { Metadata } from "next"
import DesignNavbar from "@/components/DesignNavbar"
import { signIn, sendMagicLink } from "@/app/actions/auth"

export const metadata: Metadata = {
  title: "Connexion | EuroCompare",
}

interface Props {
  searchParams: Promise<{ error?: string; magic?: string; redirect?: string }>
}

export default async function ConnexionPage({ searchParams }: Props) {
  const { error, magic, redirect: redirectTo } = await searchParams

  return (
    <>
      <DesignNavbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 420, padding: "48px 24px" }}>

          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
            Connexion
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-mute)", marginBottom: 32 }}>
            Accédez à vos favoris et alertes prix.
          </p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#dc2626" }}>
              Identifiants incorrects. Vérifiez votre email et mot de passe.
            </div>
          )}

          {magic && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#059669" }}>
              Lien de connexion envoyé — vérifiez votre boîte mail.
            </div>
          )}

          {/* Email / password form */}
          <form action={signIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
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
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
            <button type="submit" className="btn btn--primary" style={{ marginTop: 4, justifyContent: "center", borderRadius: 10, padding: "13px 20px", fontSize: 15 }}>
              Se connecter
            </button>
          </form>

          {/* Separator */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 13, color: "var(--text-mute)" }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Magic link */}
          <form action={sendMagicLink} style={{ display: "flex", gap: 10 }}>
            <input
              type="email" name="email" required
              placeholder="Lien par email"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button type="submit" className="btn btn--ghost" style={{ whiteSpace: "nowrap" }}>
              Envoyer le lien
            </button>
          </form>

          <p style={{ marginTop: 28, fontSize: 14, color: "var(--text-mute)", textAlign: "center" }}>
            Pas encore de compte ?{" "}
            <Link href="/inscription" style={{ color: "var(--blue)", fontWeight: 500 }}>
              Créer un compte
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
