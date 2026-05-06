"use client"

import { useState } from "react"
import Link from "next/link"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }
    setError("")
    setLoading(true)
    // Simulate send (no backend yet)
    setTimeout(() => { setLoading(false); setSent(true) }, 800)
  }

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-white placeholder:text-slate-400"

  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "48px 56px 40px" }}>
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors no-underline mb-6">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            Retour à l'accueil
          </Link>
          <h1 className="font-black text-slate-900 m-0" style={{ fontSize: 44, letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            Contact
          </h1>
          <p className="text-lg text-slate-500 mt-3 leading-relaxed">
            Une question, une erreur de prix à signaler, une suggestion ? Écrivez-nous.
          </p>
        </div>
      </div>

      <div style={{ padding: "56px 56px 96px" }}>
        <div className="max-w-2xl mx-auto grid gap-12" style={{ gridTemplateColumns: "1fr auto" }}>
          <div>
            {sent ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#059669" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m20 6-11 11-5-5"/></svg>
                </div>
                <h2 className="font-bold text-xl text-slate-900 mb-2">Message envoyé !</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Merci pour votre message. Nous vous répondrons dans les meilleurs délais (généralement sous 48h).
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Nom <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Jean Dupont"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="jean@exemple.fr"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sujet</label>
                  <select value={form.subject} onChange={update("subject")} className={inputClass}>
                    <option value="">Choisissez un sujet…</option>
                    <option value="prix">Erreur de prix à signaler</option>
                    <option value="produit">Demande d'ajout de produit</option>
                    <option value="affiliation">Programme d'affiliation</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    rows={6}
                    placeholder="Décrivez votre demande…"
                    className={inputClass}
                    style={{ resize: "vertical" }}
                  />
                </div>

                {error && (
                  <p className="text-xs font-medium text-rose-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 font-bold text-sm text-white rounded-xl transition-colors"
                  style={{
                    padding: "14px 24px",
                    background: loading ? "#818CF8" : "#4F46E5",
                    cursor: loading ? "not-allowed" : "pointer",
                    border: "none",
                    alignSelf: "flex-start",
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-3.5-7.1"/></svg>
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Side info */}
          <div style={{ width: 220 }}>
            <div className="flex flex-col gap-6">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-slate-400 font-mono mb-3">Email direct</div>
                <a href="mailto:contact@europrix.fr" className="text-sm font-semibold text-indigo-600 hover:underline">
                  contact@europrix.fr
                </a>
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-slate-400 font-mono mb-3">Délai de réponse</div>
                <p className="text-sm text-slate-600">Généralement sous 48h ouvrées.</p>
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-slate-400 font-mono mb-3">Signaler un prix</div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Si vous constatez une erreur de prix, précisez le nom du produit et le pays concerné.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
