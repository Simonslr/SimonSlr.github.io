"use client"

import { useState, useTransition } from "react"
import { addFavorite, removeFavorite } from "@/app/actions/favorites"
import { useToast } from "@/components/ToastProvider"

interface Props {
  slug:         string
  name:         string
  initialSaved: boolean
  isLoggedIn:   boolean
}

export default function FavoriteButton({ slug, name, initialSaved, isLoggedIn }: Props) {
  const [saved, setSaved]     = useState(initialSaved)
  const [pending, startTrans] = useTransition()
  const toast = useToast()

  const toggle = () => {
    if (!isLoggedIn) {
      window.location.href = "/connexion"
      return
    }
    startTrans(async () => {
      if (saved) {
        await removeFavorite(slug)
        setSaved(false)
        toast.show("Retiré des favoris", "info")
      } else {
        await addFavorite(slug, name)
        setSaved(true)
        toast.show("Sauvegardé dans vos favoris")
      }
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 0",
        background: "none",
        border: "none",
        color: saved ? "#dc2626" : "var(--text-mute)",
        fontSize: 14,
        fontWeight: 500,
        cursor: pending ? "default" : "pointer",
        fontFamily: "inherit",
        opacity: pending ? 0.5 : 1,
        transition: "color 180ms, opacity 180ms",
      }}
    >
      <svg
        width="17" height="17" viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {saved ? "Sauvegardé" : "Sauvegarder"}
    </button>
  )
}
