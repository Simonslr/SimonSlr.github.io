import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt    = "ComparEuro — Le même produit, moins cher en Europe"
export const size   = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0f1e",
          padding: "80px 100px",
          position: "relative",
        }}
      >
        {/* Background gradient */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(60% 60% at 80% 20%, rgba(37,99,235,0.35) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(40% 40% at 10% 80%, rgba(22,163,74,0.15) 0%, transparent 70%)",
        }} />

        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 56 }}>
          <div style={{
            width: 40, height: 40,
            background: "#2563eb",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: "white",
            fontWeight: 700,
          }}>
            ×
          </div>
          <span style={{ color: "white", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
            ComparEuro
          </span>
        </div>

        {/* Headline */}
        <div style={{ color: "white", fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 24 }}>
          Le même produit.
        </div>
        <div style={{ color: "#2563eb", fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 48 }}>
          Moins cher en Europe.
        </div>

        {/* Sub */}
        <div style={{ color: "rgba(245,245,247,0.60)", fontSize: 24, lineHeight: 1.5 }}>
          Comparez Amazon.fr · Amazon.de · Amazon.es — livraison incluse, vendeurs officiels.
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
          {["FR", "DE", "ES"].map((c) => (
            <div key={c} style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "10px 20px",
              color: "rgba(255,255,255,0.75)",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}>
              {c === "FR" ? "Amazon.fr" : c === "DE" ? "Amazon.de" : "Amazon.es"}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
