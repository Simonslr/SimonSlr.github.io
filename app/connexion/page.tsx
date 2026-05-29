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

          <div style={eyebrowStyle}>EuroCompare</div>

          <h1 style={titleStyle}>
            Bon retour<span style={{ color: "var(--blue)" }}>.</span>
          </h1>
          <p style={subStyle}>Accédez à vos favoris et alertes prix.</p>

          {error && (
            <div style={alertStyle("error")}>
              Identifiants incorrects. Vérifiez votre email et mot de passe.
            </div>
          )}
          {magic && (
            <div style={alertStyle("success")}>
              Lien de connexion envoyé — vérifiez votre boîte mail.
            </div>
          )}

          <form action={signIn} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" name="email" required
                placeholder="vous@exemple.com"
                style={inputStyle}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Mot de passe</label>
                <Link href="/mot-de-passe-oublie" style={forgotStyle}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password" name="password" required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              style={{ marginTop: 4, justifyContent: "center", borderRadius: 10, padding: "14px 20px", fontSize: 15, fontWeight: 600 }}
            >
              Se connecter
            </button>
          </form>

          <div style={dividerStyle}>
            <div style={dividerLineStyle} />
            <span style={dividerTextStyle}>ou</span>
            <div style={dividerLineStyle} />
          </div>

          <form action={sendMagicLink} style={{ display: "flex", gap: 10 }}>
            <input
              type="email" name="email" required
              placeholder="Lien par email"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn--ghost"
              style={{ whiteSpace: "nowrap", borderColor: "rgba(255,255,255,0.15)", color: "#f5f5f7" }}
            >
              Envoyer
            </button>
          </form>

          <p style={{ marginTop: 36, fontSize: 14, color: "rgba(245,245,247,0.45)", textAlign: "center" }}>
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

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains, var(--font-mono))",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(245,245,247,0.4)",
  marginBottom: 28,
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
  lineHeight: 1.5,
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

const forgotStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(245,245,247,0.4)",
  textDecoration: "none",
  transition: "color 150ms",
}

const dividerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  margin: "28px 0",
}

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: "rgba(255,255,255,0.09)",
}

const dividerTextStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(245,245,247,0.3)",
  fontFamily: "var(--font-jetbrains, monospace)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
}

function alertStyle(type: "error" | "success"): React.CSSProperties {
  const isError = type === "error"
  return {
    background: isError ? "rgba(220,38,38,0.10)" : "rgba(5,150,105,0.10)",
    border: `1px solid ${isError ? "rgba(220,38,38,0.22)" : "rgba(5,150,105,0.22)"}`,
    borderRadius: 10,
    padding: "12px 16px",
    marginBottom: 20,
    fontSize: 14,
    color: isError ? "#f87171" : "#34d399",
    lineHeight: 1.5,
  }
}
