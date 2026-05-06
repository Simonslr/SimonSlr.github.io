export default function Flag({ country, size = 20 }: { country: string; size?: number }) {
  const w = Math.round(size * 1.4)
  const h = size
  const r = Math.round(size * 0.18)

  if (country === "FR") {
    return (
      <svg width={w} height={h} viewBox="0 0 28 20" style={{ borderRadius: r, display: "block", flexShrink: 0 }}>
        <rect x="0" y="0" width="28" height="20" rx={r} fill="#fff" />
        <rect x="0" y="0" width="9.33" height="20" fill="#0055A4" />
        <rect x="18.67" y="0" width="9.33" height="20" fill="#EF4135" />
        <rect x="0" y="0" width="28" height="20" rx={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
      </svg>
    )
  }

  if (country === "DE") {
    return (
      <svg width={w} height={h} viewBox="0 0 28 20" style={{ borderRadius: r, display: "block", flexShrink: 0 }}>
        <rect x="0" y="0" width="28" height="20" rx={r} fill="#FFCE00" />
        <rect x="0" y="0" width="28" height="6.67" rx={r} fill="#000" />
        <rect x="0" y="6.67" width="28" height="6.67" fill="#DD0000" />
        <rect x="0" y="0" width="28" height="20" rx={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
      </svg>
    )
  }

  if (country === "ES") {
    return (
      <svg width={w} height={h} viewBox="0 0 28 20" style={{ borderRadius: r, display: "block", flexShrink: 0 }}>
        <rect x="0" y="0" width="28" height="20" rx={r} fill="#AA151B" />
        <rect x="0" y="5" width="28" height="10" fill="#F1BF00" />
        <rect x="0" y="0" width="28" height="20" rx={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
      </svg>
    )
  }

  // Fallback générique
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: w, height: h, borderRadius: r,
        background: "#E2E8F0", fontSize: size * 0.5,
        fontWeight: 700, color: "#64748B", flexShrink: 0,
        fontFamily: "ui-monospace, monospace", letterSpacing: "0.05em",
      }}
    >
      {country.slice(0, 2)}
    </span>
  )
}
