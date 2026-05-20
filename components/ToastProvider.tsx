"use client"

import { createContext, useContext, useState, useCallback, useRef } from "react"

interface Toast {
  id:      number
  message: string
  type:    "success" | "error" | "info"
}

interface ToastCtx {
  show: (message: string, type?: Toast["type"]) => void
}

const Ctx = createContext<ToastCtx>({ show: () => {} })

export function useToast() {
  return useContext(Ctx)
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const show = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const colors: Record<Toast["type"], { bg: string; border: string; dot: string }> = {
    success: { bg: "#f0fdf4", border: "#bbf7d0", dot: "#059669" },
    error:   { bg: "#fef2f2", border: "#fecaca", dot: "#dc2626" },
    info:    { bg: "#eef4ff", border: "#bfdbfe", dot: "#2563eb" },
  }

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {/* Toast stack */}
      <div style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        pointerEvents: "none",
      }}>
        {toasts.map((t) => {
          const c = colors[t.type]
          return (
            <div
              key={t.id}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 10,
                padding: "11px 18px",
                fontSize: 14,
                fontWeight: 500,
                color: "#0f172a",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                animation: "toast-in 280ms cubic-bezier(.16,1,.3,1)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
              {t.message}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </Ctx.Provider>
  )
}
