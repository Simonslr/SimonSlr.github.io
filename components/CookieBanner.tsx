"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const KEY = "ec_cookie_consent"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  const accept = () => { localStorage.setItem(KEY, "accepted"); setVisible(false) }
  const refuse = () => { localStorage.setItem(KEY, "rejected"); setVisible(false) }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "min(92vw, 640px)",
        background: "#000000",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 0,
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
        animation: "toast-in 300ms cubic-bezier(0.32,0.72,0,1) both",
      }}
    >
      <p style={{
        flex: 1,
        minWidth: 200,
        margin: 0,
        fontSize: 13,
        lineHeight: 1.5,
        color: "rgba(255,255,255,0.75)",
      }}>
        Nous utilisons des cookies d&apos;analyse pour améliorer l&apos;expérience.{" "}
        <Link href="/cookies" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>
          En savoir plus
        </Link>
      </p>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={refuse}
          style={{
            padding: "8px 16px",
            borderRadius: 75,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Refuser
        </button>
        <button
          onClick={accept}
          style={{
            padding: "8px 18px",
            borderRadius: 75,
            border: "none",
            background: "#636363",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Accepter
        </button>
      </div>
    </div>
  )
}
