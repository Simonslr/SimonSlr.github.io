import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import DesignNavbar from "@/components/DesignNavbar"
import { createClient } from "@/lib/supabase/server"
import { updatePassword } from "@/app/actions/auth"

export const metadata: Metadata = {
  title: "Nouveau mot de passe | EuroCompare",
}

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function NouveauMotDePassePage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/connexion")

  const { error } = await searchParams

  const errorMsg = error === "mismatch"
    ? "Les mots de passe ne correspondent pas."
    : error === "invalid"
    ? "Le mot de passe doit contenir au moins 6 caractères."
    : error
    ? "Une erreur est survenue. Réessayez."
    : null

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
            Nouveau mot de passe<span style={{ color: "var(--blue)" }}>.</span>
          </h1>
          <p style={subStyle}>
            Choisissez un nouveau mot de passe pour votre compte.
          </p>

          {errorMsg && (
            <div style={alertErrorStyle}>{errorMsg}</div>
          )}

          <form action={updatePassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Nouveau mot de passe</label>
              <input
                type="password" name="password" required
                placeholder="Minimum 6 caractères"
                minLength={6}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <input
                type="password" name="confirm" required
                placeholder="••••••••"
                minLength={6}
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              className="btn btn--primary"
              style={{ marginTop: 4, justifyContent: "center", borderRadius: 10, padding: "14px 20px", fontSize: 15, fontWeight: 600 }}
            >
              Enregistrer le nouveau mot de passe
            </button>
          </form>

          <p style={{ marginTop: 28, textAlign: "center" }}>
            <Link href="/connexion" style={{ fontSize: 13, color: "rgba(245,245,247,0.35)", textDecoration: "none" }}>
              ← Retour à la connexion
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
  fontSize: "clamp(36px, 6vw, 52px)",
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

const alertErrorStyle: React.CSSProperties = {
  background: "rgba(220,38,38,0.10)",
  border: "1px solid rgba(220,38,38,0.22)",
  borderRadius: 10,
  padding: "12px 16px",
  marginBottom: 20,
  fontSize: 14,
  color: "#f87171",
}
