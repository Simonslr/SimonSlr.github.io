type IlluProps = { type: string; size?: number; dark?: boolean }

export default function ProductIllustration({ type, size = 120, dark = false }: IlluProps) {
  const bg = dark ? "#1E293B" : "#F1F5F9"
  const accent = dark ? "#fff" : "#0F172A"
  const muted = dark ? "rgba(255,255,255,0.4)" : "#94A3B8"
  const s = Math.min(size * 0.7, 200)

  const wrap = (children: React.ReactNode) => (
    <div style={{
      width: "100%", height: size, borderRadius: 12,
      background: `radial-gradient(circle at 30% 20%, ${dark ? "#334155" : "#fff"} 0%, ${bg} 75%)`,
      border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
      display: "grid", placeItems: "center", overflow: "hidden",
    }}>
      {children}
    </div>
  )

  switch (type) {
    // Écouteurs (airpods-pro, airpods-pro-2)
    case "airpods-pro":
    case "airpods-pro-2":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="32" y="22" width="36" height="44" rx="14" fill={accent}/>
          <rect x="36" y="32" width="28" height="2" rx="1" fill={muted}/>
          <ellipse cx="38" cy="68" rx="6" ry="9" fill={accent}/>
          <ellipse cx="62" cy="68" rx="6" ry="9" fill={accent}/>
          <rect x="36" y="73" width="2" height="14" fill={accent}/>
          <rect x="62" y="73" width="2" height="14" fill={accent}/>
        </svg>
      )
    // Casque (sony-wh1000xm5, wh-1000)
    case "wh-1000":
    case "sony-wh1000xm5":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <path d="M20 55 Q20 25 50 25 Q80 25 80 55" stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round"/>
          <rect x="14" y="50" width="14" height="28" rx="6" fill={accent}/>
          <rect x="72" y="50" width="14" height="28" rx="6" fill={accent}/>
          <circle cx="21" cy="64" r="3" fill={muted}/>
          <circle cx="79" cy="64" r="3" fill={muted}/>
        </svg>
      )
    // SSD
    case "ssd-990":
    case "ssd-samsung-990-pro-1tb":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="20" y="38" width="60" height="22" rx="3" fill={accent}/>
          <rect x="22" y="40" width="20" height="18" rx="1" fill={muted} opacity="0.4"/>
          <rect x="44" y="40" width="14" height="18" fill={muted} opacity="0.25"/>
          <rect x="60" y="40" width="18" height="18" fill={muted} opacity="0.4"/>
          <rect x="20" y="60" width="60" height="3" fill={muted} opacity="0.5"/>
          {Array.from({length: 8}).map((_, i) => (
            <rect key={i} x={22 + i * 7} y="63" width="3" height="4" fill={accent}/>
          ))}
        </svg>
      )
    // Liseuse
    case "kindle":
    case "kindle-paperwhite-16go":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="26" y="18" width="48" height="64" rx="4" fill={accent}/>
          <rect x="30" y="22" width="40" height="48" rx="1" fill={dark ? "#fff" : "#F8FAFC"}/>
          <rect x="34" y="28" width="32" height="2" fill={muted}/>
          <rect x="34" y="33" width="28" height="2" fill={muted}/>
          <rect x="34" y="38" width="30" height="2" fill={muted}/>
          <rect x="34" y="43" width="24" height="2" fill={muted}/>
          <rect x="34" y="48" width="28" height="2" fill={muted}/>
        </svg>
      )
    // Tablette (ipad-10, tablet)
    case "tablet":
    case "ipad-10":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" rx="6" fill={accent}/>
          <rect x="24" y="24" width="52" height="52" rx="2" fill={dark ? "#1e293b" : "#fff"}/>
          <rect x="30" y="30" width="40" height="3" rx="1" fill={muted} opacity="0.6"/>
          <rect x="30" y="38" width="18" height="18" rx="2" fill={muted} opacity="0.3"/>
          <rect x="52" y="38" width="18" height="18" rx="2" fill={muted} opacity="0.3"/>
          <rect x="30" y="60" width="40" height="10" rx="2" fill={muted} opacity="0.25"/>
        </svg>
      )
    // Montre (apple-watch-se-2, watch)
    case "watch":
    case "apple-watch-se-2":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="40" y="10" width="20" height="14" rx="3" fill={accent}/>
          <rect x="40" y="76" width="20" height="14" rx="3" fill={accent}/>
          <rect x="32" y="26" width="36" height="48" rx="9" fill={accent}/>
          <rect x="36" y="30" width="28" height="40" rx="5" fill={dark ? "#0f172a" : "#0F172A"}/>
          <text x="50" y="55" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="ui-monospace,monospace">9:41</text>
        </svg>
      )
    // Console (ps5-slim, console)
    case "console":
    case "ps5-slim":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="14" y="36" width="72" height="28" rx="3" fill={accent}/>
          <rect x="20" y="42" width="36" height="16" rx="1" fill={muted} opacity="0.3"/>
          <circle cx="68" cy="50" r="3" fill={muted}/>
          <circle cx="76" cy="50" r="3" fill={muted}/>
          <rect x="14" y="64" width="72" height="3" fill={muted} opacity="0.5"/>
        </svg>
      )
    // Smartphone (samsung-galaxy-s24)
    case "samsung-galaxy-s24":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="32" y="14" width="36" height="72" rx="8" fill={accent}/>
          <rect x="36" y="20" width="28" height="56" rx="3" fill={dark ? "#1e293b" : "#fff"}/>
          <circle cx="50" cy="82" r="3" fill={muted}/>
          <rect x="44" y="17" width="12" height="2" rx="1" fill={muted}/>
        </svg>
      )
    // Aspirateur Dyson
    case "dyson-v8":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="46" y="10" width="8" height="50" rx="4" fill={accent}/>
          <rect x="30" y="60" width="40" height="8" rx="4" fill={accent}/>
          <rect x="34" y="68" width="32" height="5" rx="2" fill={muted} opacity="0.5"/>
          <ellipse cx="50" cy="60" rx="14" ry="8" fill={muted} opacity="0.3"/>
          <circle cx="50" cy="30" r="8" fill={muted} opacity="0.3"/>
        </svg>
      )
    // Cafetière De'Longhi
    case "delonghi-dedica":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="34" y="20" width="32" height="60" rx="4" fill={accent}/>
          <rect x="38" y="28" width="24" height="16" rx="2" fill={muted} opacity="0.3"/>
          <circle cx="50" cy="55" r="8" fill={muted} opacity="0.4"/>
          <rect x="66" y="42" width="10" height="4" rx="2" fill={accent}/>
          <rect x="34" y="75" width="32" height="5" rx="2" fill={muted} opacity="0.5"/>
        </svg>
      )
    default:
      return wrap(
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          PRODUIT
        </div>
      )
  }
}
