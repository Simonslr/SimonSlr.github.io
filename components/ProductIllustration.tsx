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
    // Écouteurs (airpods)
    case "airpods-pro":
    case "airpods-pro-2":
    case "airpods-4":
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
    // Tablette (ipad)
    case "tablet":
    case "ipad-10":
    case "ipad-11":
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
    // Console (ps5)
    case "console":
    case "ps5-slim":
    case "ps5-standard":
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
    // Laptop
    case "macbook-air-m2":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="18" y="28" width="64" height="42" rx="3" fill={accent}/>
          <rect x="22" y="32" width="56" height="34" rx="1" fill={dark ? "#0f172a" : "#1e293b"}/>
          <rect x="10" y="70" width="80" height="5" rx="2" fill={accent}/>
          <rect x="36" y="68" width="28" height="2" rx="1" fill={muted} opacity="0.5"/>
        </svg>
      )
    // Enceinte
    case "jbl-charge-5":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="20" y="35" width="60" height="30" rx="15" fill={accent}/>
          <circle cx="38" cy="50" r="9" fill={muted} opacity="0.4"/>
          <circle cx="38" cy="50" r="5" fill={muted} opacity="0.6"/>
          <circle cx="62" cy="50" r="9" fill={muted} opacity="0.4"/>
          <circle cx="62" cy="50" r="5" fill={muted} opacity="0.6"/>
          <rect x="24" y="66" width="52" height="4" rx="2" fill={accent}/>
        </svg>
      )
    // Manette gaming
    case "dualsense-ps5":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <path d="M25 45 Q20 65 28 72 Q36 78 42 68 L50 60 L58 68 Q64 78 72 72 Q80 65 75 45 L70 35 Q60 25 50 28 Q40 25 30 35 Z" fill={accent}/>
          <circle cx="38" cy="45" r="4" fill={muted} opacity="0.4"/>
          <circle cx="62" cy="45" r="4" fill={muted} opacity="0.4"/>
          <rect x="45" y="40" width="10" height="2" rx="1" fill={muted} opacity="0.5"/>
        </svg>
      )
    // Caméra action
    case "gopro-hero-13":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="22" y="32" width="56" height="38" rx="6" fill={accent}/>
          <rect x="26" y="36" width="48" height="30" rx="3" fill={dark ? "#0f172a" : "#1e293b"}/>
          <circle cx="50" cy="51" r="10" fill={muted} opacity="0.3"/>
          <circle cx="50" cy="51" r="6" fill={muted} opacity="0.5"/>
          <circle cx="50" cy="51" r="3" fill={accent}/>
          <rect x="28" y="24" width="12" height="8" rx="2" fill={accent}/>
        </svg>
      )
    // Robot aspirateur
    case "roborock-s8":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <circle cx="50" cy="52" r="28" fill={accent}/>
          <circle cx="50" cy="52" r="22" fill={dark ? "#1e293b" : "#f1f5f9"}/>
          <circle cx="50" cy="52" r="8" fill={accent}/>
          <circle cx="50" cy="30" r="3" fill={muted} opacity="0.6"/>
          <rect x="30" y="74" width="40" height="5" rx="2" fill={muted} opacity="0.5"/>
        </svg>
      )
    // Souris
    case "logitech-mx-master-3s":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <path d="M35 30 Q35 20 50 20 Q65 20 65 30 L65 70 Q65 82 50 82 Q35 82 35 70 Z" fill={accent}/>
          <path d="M35 30 L50 30 L50 55 Q35 55 35 42 Z" fill={muted} opacity="0.3"/>
          <rect x="48" y="20" width="4" height="35" rx="2" fill={muted} opacity="0.5"/>
          <circle cx="57" cy="42" r="3" fill={muted} opacity="0.4"/>
        </svg>
      )
    // AirTag
    case "apple-airtag-4pack":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <circle cx="35" cy="38" r="14" fill={accent}/>
          <circle cx="65" cy="38" r="14" fill={accent}/>
          <circle cx="35" cy="63" r="14" fill={accent}/>
          <circle cx="65" cy="63" r="14" fill={accent}/>
          <circle cx="35" cy="38" r="6" fill={muted} opacity="0.4"/>
          <circle cx="65" cy="38" r="6" fill={muted} opacity="0.4"/>
          <circle cx="35" cy="63" r="6" fill={muted} opacity="0.4"/>
          <circle cx="65" cy="63" r="6" fill={muted} opacity="0.4"/>
        </svg>
      )
    // SSD externe
    case "samsung-t7-1to":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="28" y="28" width="44" height="44" rx="8" fill={accent}/>
          <rect x="34" y="34" width="32" height="32" rx="4" fill={muted} opacity="0.2"/>
          <rect x="38" y="48" width="24" height="3" rx="1" fill={muted} opacity="0.6"/>
          <rect x="38" y="55" width="16" height="3" rx="1" fill={muted} opacity="0.4"/>
          <rect x="64" y="44" width="8" height="12" rx="3" fill={dark ? "#334155" : "#E2E8F0"}/>
        </svg>
      )
    // Nintendo Switch
    case "nintendo-switch-oled":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="22" y="28" width="56" height="44" rx="4" fill={accent}/>
          <rect x="28" y="33" width="44" height="34" rx="2" fill={dark ? "#0f172a" : "#1e293b"}/>
          <rect x="22" y="33" width="8" height="34" fill={dark ? "#ef4444" : "#dc2626"}/>
          <rect x="70" y="33" width="8" height="34" fill={dark ? "#3b82f6" : "#2563eb"}/>
          <circle cx="74" cy="43" r="2" fill={muted} opacity="0.6"/>
          <circle cx="74" cy="55" r="2" fill={muted} opacity="0.6"/>
        </svg>
      )
    // Xbox
    case "xbox-series-x":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="30" y="20" width="40" height="60" rx="8" fill={accent}/>
          <circle cx="50" cy="45" r="12" fill={dark ? "#166534" : "#16a34a"}/>
          <circle cx="50" cy="45" r="7" fill={accent}/>
          <rect x="38" y="62" width="24" height="6" rx="3" fill={muted} opacity="0.4"/>
          <circle cx="50" cy="30" r="4" fill={muted} opacity="0.3"/>
        </svg>
      )
    // Garmin Fenix / Forerunner
    case "garmin-fenix-7":
    case "garmin-forerunner-265":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="42" y="10" width="16" height="12" rx="3" fill={accent}/>
          <rect x="42" y="78" width="16" height="12" rx="3" fill={accent}/>
          <rect x="30" y="24" width="40" height="52" rx="10" fill={accent}/>
          <rect x="34" y="28" width="32" height="44" rx="6" fill={dark ? "#0f172a" : "#0F172A"}/>
          <text x="50" y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="ui-monospace,monospace">GPS</text>
          <rect x="36" y="55" width="28" height="2" rx="1" fill={muted} opacity="0.4"/>
        </svg>
      )
    // iPhone
    case "iphone-16":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="32" y="14" width="36" height="72" rx="9" fill={accent}/>
          <rect x="36" y="20" width="28" height="56" rx="4" fill={dark ? "#1e293b" : "#fff"}/>
          <rect x="42" y="16" width="16" height="4" rx="2" fill={muted} opacity="0.5"/>
          <circle cx="50" cy="82" r="4" fill={muted} opacity="0.4"/>
          <circle cx="42" cy="28" r="3" fill={muted} opacity="0.3"/>
          <circle cx="49" cy="28" r="3" fill={muted} opacity="0.3"/>
        </svg>
      )
    // LEGO
    case "lego-technic-lamborghini":
      return wrap(
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="28" y="40" width="44" height="36" rx="2" fill={accent}/>
          {Array.from({length: 4}).map((_, i) => (
            <circle key={i} cx={36 + i*9} cy="36" r="4" fill={accent}/>
          ))}
          <rect x="36" y="48" width="28" height="4" fill={muted} opacity="0.3"/>
          <rect x="36" y="56" width="20" height="4" fill={muted} opacity="0.3"/>
          <rect x="36" y="64" width="24" height="4" fill={muted} opacity="0.3"/>
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
