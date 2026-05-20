"use client"

import { useState } from "react"
import Link from "next/link"
import DesignNavbar from "@/components/DesignNavbar"

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  const update = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 800)
  }

  return (
    <>
      <DesignNavbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--bg)" }}>
        <div className="wrap" style={{ paddingTop: 48, paddingBottom: 100 }}>

          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-mute)", textDecoration: "none", marginBottom: 32 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            Accueil
          </Link>

          <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(40px, 5vw, 68px)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 12 }}>
            Contact.
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-mute)", marginBottom: 48, maxWidth: "52ch" }}>
            Une question, une erreur de prix à signaler, une suggestion ?
          </p>

          {sent ? (
            <div style={{ maxWidth: 520, padding: "32px", background: "var(--green-soft, #ecfdf3)", border: "1px solid #bbf7d0", borderRadius: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Message envoyé</h2>
              <p style={{ fontSize: 15, color: "var(--text-mute)", lineHeight: 1.65, marginBottom: 20 }}>
                Merci. Nous vous répondrons dans les 48h ouvrées.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                style={{ background: "none", border: "none", fontSize: 14, color: "var(--blue)", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 64, maxWidth: 800, alignItems: "start" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Nom <span style={{ color: "var(--red)" }}>*</span></label>
                    <input type="text" value={form.name} onChange={update("name")} placeholder="Jean Dupont" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: "var(--red)" }}>*</span></label>
                    <input type="email" value={form.email} onChange={update("email")} placeholder="jean@exemple.fr" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Sujet</label>
                  <select value={form.subject} onChange={update("subject")} style={inputStyle}>
                    <option value="">Choisissez un sujet…</option>
                    <option value="prix">Erreur de prix à signaler</option>
                    <option value="produit">Demande d'ajout de produit</option>
                    <option value="affiliation">Programme d'affiliation</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Message <span style={{ color: "var(--red)" }}>*</span></label>
                  <textarea value={form.message} onChange={update("message")} rows={6} placeholder="Décrivez votre demande…" style={{ ...inputStyle, resize: "vertical" }} />
                </div>

                {error && <p style={{ fontSize: 13, color: "var(--red)", margin: 0 }}>{error}</p>}

                <div>
                  <button type="submit" disabled={loading} className="btn btn--primary" style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Envoi…" : "Envoyer le message"}
                  </button>
                </div>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 4 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 8 }}>Email direct</div>
                  <a href="mailto:contact@eurocompare.fr" style={{ fontSize: 14, color: "var(--blue)" }}>contact@eurocompare.fr</a>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 8 }}>Délai de réponse</div>
                  <p style={{ fontSize: 14, color: "var(--text-mute)", margin: 0 }}>Généralement sous 48h ouvrées.</p>
                </div>
              </div>
            </div>
          )}
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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--text-mute)",
  marginBottom: 6,
}
