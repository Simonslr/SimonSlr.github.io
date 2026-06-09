// ── Geometry ──────────────────────────────────────────────────────────────
const STAR_R = 42
const STAR_SIZE = 4.2
const A = 17, B = 33

// 4 arrows forming an X through the center, each pointing outward to a corner
const ARROWS = [
  { d: `M ${50-4} ${50-4} Q ${B-5} ${A+8} ${A} ${A}`,             hx: A,     hy: A,     hang: -135 },
  { d: `M ${50+4} ${50-4} Q ${100-B+5} ${A+8} ${100-A} ${A}`,     hx: 100-A, hy: A,     hang: -45  },
  { d: `M ${50+4} ${50+4} Q ${100-B+5} ${100-A-8} ${100-A} ${100-A}`, hx: 100-A, hy: 100-A, hang: 45 },
  { d: `M ${50-4} ${50+4} Q ${B-5} ${100-A-8} ${A} ${100-A}`,     hx: A,     hy: 100-A, hang: 135  },
]

function computeStars() {
  const s: { x: number; y: number }[] = []
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2
    s.push({ x: 50 + STAR_R * Math.cos(a), y: 50 + STAR_R * Math.sin(a) })
  }
  return s
}
const STARS = computeStars()

function StarShape({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2
    const rr = i % 2 === 0 ? r : r * 0.45
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(4)},${(cy + rr * Math.sin(a)).toFixed(4)}`)
  }
  return <polygon points={pts.join(" ")} fill={fill} />
}

// ── Static logo (server component, progress = 1) ───────────────────────────
export default function CompareUroLogo({
  size = 40,
  showText = true,
  textColor = "#0F172A",
  color = "#0F172A",
}: {
  size?: number
  showText?: boolean
  textColor?: string
  color?: string
}) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.25 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", flexShrink: 0 }}>
        {ARROWS.map((a, i) => (
          <g key={i}>
            <path d={a.d} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
            <g transform={`translate(${a.hx} ${a.hy}) rotate(${a.hang})`}>
              <polygon points="0,0 10,4 10,-4" fill={color} />
            </g>
          </g>
        ))}
        {STARS.map((s, i) => (
          <StarShape key={i} cx={s.x} cy={s.y} r={STAR_SIZE} fill={color} />
        ))}
      </svg>
      {showText && (
        <span style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: size * 0.5, color: textColor }}>
          ComparEuro
        </span>
      )}
    </div>
  )
}

// ── Export geometry for use in IntroSplash ─────────────────────────────────
export { ARROWS, STARS, StarShape, STAR_SIZE }
