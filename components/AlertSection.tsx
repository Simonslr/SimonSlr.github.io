"use client"

import { useState, useTransition } from "react"
import { createAlert } from "@/app/actions/alerts"
import { useToast } from "@/components/ToastProvider"

interface ExistingAlert {
  id:           string
  target_price: number
  triggered:    boolean
}

interface Props {
  slug:          string
  name:          string
  bestPrice:     number
  bestCountry:   string
  isLoggedIn:    boolean
  existingAlert: ExistingAlert | null
}

function fmt(n: number) {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2).replace(".", ",")
}

export default function AlertSection({ slug, name, bestPrice, bestCountry, isLoggedIn, existingAlert }: Props) {
  const suggested = Math.round(bestPrice * 0.95 * 100) / 100
  const [target, setTarget]     = useState(String(fmt(suggested)))
  const [done, setDone]         = useState(false)
  const [pending, startTrans]   = useTransition()
  const toast = useToast()

  if (!isLoggedIn) {
    return (
      <div style={cardStyle}>
        <p style={{ fontSize: 14, color: "var(--text-mute)", marginBottom: 12 }}>
          Connectez-vous pour recevoir une alerte quand ce prix baisse.
        </p>
        <a href="/connexion" className="btn btn--ghost" style={{ fontSize: 14 }}>
          Se connecter →
        </a>
      </div>
    )
  }

  if (existingAlert) {
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: existingAlert.triggered ? "#22c55e" : "#f59e0b", display: "inline-block" }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {existingAlert.triggered ? "Alerte déclenchée ✓" : "Alerte active"}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-mute)" }}>
          Seuil : {fmt(existingAlert.target_price)} €
          {existingAlert.triggered && " — vous avez reçu un email"}
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div style={{ ...cardStyle, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#059669" }}>
          Alerte créée ✓ Vous serez notifié par email dès que le prix passe sous {target} €.
        </p>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
        Alerte prix
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
          <span style={{ padding: "9px 12px", fontSize: 14, color: "var(--text-mute)", borderRight: "1px solid var(--border)", background: "var(--bg-soft, #f8f9fa)" }}>
            Sous
          </span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            min={1}
            step={0.01}
            style={{ padding: "9px 10px", fontSize: 15, border: "none", outline: "none", width: 90, fontFamily: "inherit", fontVariantNumeric: "tabular-nums" }}
          />
          <span style={{ padding: "9px 12px", fontSize: 14, color: "var(--text-mute)", borderLeft: "1px solid var(--border)", background: "var(--bg-soft, #f8f9fa)" }}>
            €
          </span>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTrans(async () => {
              const t = parseFloat(target.replace(",", "."))
              if (isNaN(t) || t <= 0) return
              const res = await createAlert(slug, name, t, bestCountry, bestPrice)
              if (!("error" in res)) {
                setDone(true)
                toast.show(`Alerte créée — vous serez notifié sous ${target} €`)
              } else {
                toast.show("Erreur lors de la création de l'alerte", "error")
              }
            })
          }
          className="btn btn--ghost"
          style={{ fontSize: 14, opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "…" : "Créer l'alerte"}
        </button>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 8 }}>
        Email gratuit dès que le prix passe sous votre seuil.
      </p>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  marginTop: 20,
  padding: "18px 20px",
  border: "1px solid var(--border)",
  borderRadius: 12,
  background: "var(--bg)",
}
