"use client"

import { useTransition } from "react"
import { deleteAlert } from "@/app/actions/alerts"

export default function DeleteAlertButton({ alertId }: { alertId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => { await deleteAlert(alertId) })}
      style={{
        fontSize: 13,
        color: pending ? "var(--text-mute)" : "#dc2626",
        background: "transparent",
        border: "none",
        cursor: pending ? "default" : "pointer",
        padding: "4px 8px",
        borderRadius: 6,
        fontFamily: "inherit",
      }}
    >
      {pending ? "…" : "Supprimer"}
    </button>
  )
}
