'use client'
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// ── Brand tokens ────────────────────────────────────────────────────────────
const BG        = '#060c18'
const BG_CARD   = '#0d1a2e'
const BLUE      = '#3b82f6'
const BLUE_DIM  = '#1d4ed8'
const WHITE     = '#f0f4ff'
const MUTED     = 'rgba(203,213,225,0.60)'
const BORDER    = 'rgba(255,255,255,0.09)'
const FONT      = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif'
const MONO      = '"JetBrains Mono", "Fira Code", "Courier New", monospace'

const COUNTRIES = [
  { code: 'FR', label: 'Amazon.fr',  price: 349, color: '#60a5fa', flag: ['#002395','#f0f4ff','#ED2939'] },
  { code: 'DE', label: 'Amazon.de',  price: 289, color: '#fbbf24', flag: ['#1a1a1a','#cc0000','#ffce00'] },
  { code: 'ES', label: 'Amazon.es',  price: 259, color: '#34d399', flag: ['#c60b1e','#ffc400','#c60b1e'], best: true },
]
const MAX_PRICE = 349
const SAVINGS   = 90
const PCT       = 26

// Deterministic particle field (no Math.random — stable per-frame)
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  x:  (i * 137.508) % 1080,
  y:  (i * 233.718) % 1920,
  r:  1.2 + (i % 4) * 0.8,
  op: 0.06 + (i % 5) * 0.04,
  dy: 0.25 + (i % 6) * 0.12,
}))

// ── Animation helpers ───────────────────────────────────────────────────────
const spr = (frame: number, delay = 0, damping = 16, stiffness = 160) =>
  spring({ frame: Math.max(0, frame - delay), fps: 30, config: { damping, stiffness, mass: 1 } })

const ease = (frame: number, inF: number, outF: number, from = 0, to = 1) =>
  interpolate(frame, [inF, outF], [from, to], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  })

const easeIn = (frame: number, inF: number, outF: number, from = 0, to = 1) =>
  interpolate(frame, [inF, outF], [from, to], {
    easing: Easing.bezier(0.55, 0, 1, 0.45),
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  })

// ── Sub-components ──────────────────────────────────────────────────────────

function FlagStripes({
  stripes, vertical = false, size = 28,
}: { stripes: string[]; vertical?: boolean; size?: number }) {
  return (
    <div style={{
      width: vertical ? size * 1.4 : size * 1.4,
      height: size,
      borderRadius: 4,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: vertical ? 'row' : 'column',
      border: '1px solid rgba(255,255,255,0.15)',
      flexShrink: 0,
    }}>
      {stripes.map((c, i) => (
        <div key={i} style={{ flex: 1, background: c }} />
      ))}
    </div>
  )
}

function Particles({ frame }: { frame: number }) {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x,
          top: (p.y - frame * p.dy * 0.6) % 1920,
          width: p.r * 2,
          height: p.r * 2,
          borderRadius: '50%',
          background: BLUE,
          opacity: p.op,
          filter: 'blur(0.5px)',
        }} />
      ))}
    </AbsoluteFill>
  )
}

function GlowOrb({ x, y, color, radius, opacity }: {
  x: number; y: number; color: string; radius: number; opacity: number
}) {
  return (
    <div style={{
      position: 'absolute',
      left: x - radius, top: y - radius,
      width: radius * 2, height: radius * 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      pointerEvents: 'none',
    }} />
  )
}

// ── SCENE 1: HOOK (0–75f = 0–2.5s) ────────────────────────────────────────
function SceneHook() {
  const f = useCurrentFrame()

  const euroScale = spr(f, 0, 22, 280)
  const euroOp    = ease(f, 0, 12)
  const textOp    = ease(f, 20, 42)
  const textClip  = ease(f, 20, 52)
  const subtextOp = ease(f, 38, 58)

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 0, padding: '0 80px',
    }}>
      {/* Glow orb behind */}
      <GlowOrb x={540} y={900} color={BLUE} radius={340} opacity={0.12 * ease(f, 5, 35)} />

      {/* Euro symbol */}
      <div style={{
        fontSize: 96,
        fontFamily: MONO,
        fontWeight: 800,
        color: BLUE,
        opacity: euroOp,
        transform: `scale(${euroScale})`,
        marginBottom: 32,
        filter: `drop-shadow(0 0 32px ${BLUE}66)`,
        letterSpacing: '-0.04em',
      }}>€</div>

      {/* Main hook */}
      <div style={{
        overflow: 'hidden',
        clipPath: `inset(0 ${(1 - textClip) * 102}% 0 0)`,
        opacity: textOp,
      }}>
        <h1 style={{
          fontFamily: FONT,
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: '-0.045em',
          lineHeight: 1.05,
          color: WHITE,
          margin: 0,
          textAlign: 'center',
        }}>
          Vous payez<br />trop cher.
        </h1>
      </div>

      {/* Subtext */}
      <p style={{
        fontFamily: FONT,
        fontSize: 30,
        color: MUTED,
        marginTop: 28,
        opacity: subtextOp,
        letterSpacing: '-0.01em',
        textAlign: 'center',
      }}>
        Et vous ne le savez pas encore.
      </p>
    </AbsoluteFill>
  )
}

// ── SCENE 2: BIG PRICE (75–180f = 2.5–6s) ─────────────────────────────────
function SceneBigPrice() {
  const f = useCurrentFrame()

  const priceScale = spr(f, 0, 20, 240)
  const priceOp    = ease(f, 0, 18)
  const labelOp    = ease(f, 22, 42)
  const glowOp     = ease(f, 30, 60)
  const exitOp     = easeIn(f, 85, 105, 1, 0)

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <GlowOrb x={540} y={960} color="#ef4444" radius={380} opacity={0.09 * glowOp} />

      <div style={{
        opacity: priceOp * exitOp,
        transform: `scale(${priceScale})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* The painful price */}
        <div style={{
          fontFamily: FONT,
          fontSize: 168,
          fontWeight: 900,
          letterSpacing: '-0.06em',
          color: WHITE,
          lineHeight: 1,
          filter: `drop-shadow(0 0 48px rgba(239,68,68,0.20))`,
        }}>
          349 €
        </div>

        {/* Label */}
        <div style={{
          opacity: labelOp,
          marginTop: 20,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <FlagStripes stripes={COUNTRIES[0].flag} vertical size={26} />
          <span style={{
            fontFamily: MONO,
            fontSize: 26,
            color: MUTED,
            letterSpacing: '0.05em',
          }}>
            Amazon.fr
          </span>
        </div>

        {/* "C'est le prix que vous payez" */}
        <p style={{
          fontFamily: FONT,
          fontSize: 24,
          color: 'rgba(203,213,225,0.40)',
          marginTop: 40,
          opacity: labelOp,
          letterSpacing: '-0.01em',
        }}>
          C'est le prix que vous avez toujours payé.
        </p>
      </div>
    </AbsoluteFill>
  )
}

// ── SCENE 3: COMPARISON TABLE (180–345f = 6–11.5s) ────────────────────────
function SceneCompare() {
  const f = useCurrentFrame()

  const titleOp = ease(f, 0, 20)
  const exitOp  = easeIn(f, 140, 165, 1, 0)

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 56px',
    }}>
      <GlowOrb x={540} y={880} color={BLUE} radius={360} opacity={0.10 * ease(f, 20, 50)} />

      {/* Eyebrow */}
      <p style={{
        fontFamily: MONO,
        fontSize: 18,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: `rgba(96,165,250,0.70)`,
        margin: '0 0 36px',
        opacity: titleOp * exitOp,
      }}>
        Le même casque — 3 prix
      </p>

      {/* Title */}
      <h2 style={{
        fontFamily: FONT,
        fontSize: 62,
        fontWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: 1.1,
        color: WHITE,
        margin: '0 0 56px',
        textAlign: 'center',
        opacity: titleOp * exitOp,
      }}>
        Comparer prend<br />10 secondes.
      </h2>

      {/* Rows */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {COUNTRIES.map((c, i) => {
          const delay = i * 22
          const rowSpr  = spr(f, delay, 18, 160)
          const rowOp   = ease(f, delay, delay + 20)
          const barPct  = c.price / MAX_PRICE * 100
          const barAnim = ease(f, delay + 18, delay + 48, 0, barPct)
          const savings = MAX_PRICE - c.price
          const isBest  = c.best === true

          return (
            <div key={c.code} style={{
              opacity: rowOp * exitOp,
              transform: `translateY(${(1 - rowSpr) * 40}px)`,
              background: isBest
                ? `linear-gradient(135deg, rgba(16,42,74,0.9), rgba(14,32,60,0.9))`
                : `rgba(13,26,46,0.8)`,
              border: isBest ? `1.5px solid ${BLUE}55` : `1px solid ${BORDER}`,
              borderRadius: 20,
              padding: '28px 32px',
              backdropFilter: 'blur(20px)',
              boxShadow: isBest
                ? `0 0 48px rgba(59,130,246,0.15), 0 4px 24px rgba(0,0,0,0.30)`
                : `0 4px 20px rgba(0,0,0,0.25)`,
            }}>
              {/* Top row: flag + label + price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                <FlagStripes stripes={c.flag} vertical size={30} />
                <span style={{
                  fontFamily: FONT,
                  fontSize: 26,
                  fontWeight: 600,
                  color: isBest ? WHITE : MUTED,
                  flex: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {c.label}
                </span>
                {isBest && (
                  <div style={{
                    background: BLUE,
                    color: '#fff',
                    fontFamily: MONO,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 6,
                    letterSpacing: '0.05em',
                  }}>
                    MEILLEUR PRIX
                  </div>
                )}
                <span style={{
                  fontFamily: FONT,
                  fontSize: 36,
                  fontWeight: 800,
                  color: isBest ? BLUE : WHITE,
                  letterSpacing: '-0.04em',
                  filter: isBest ? `drop-shadow(0 0 16px ${BLUE}88)` : undefined,
                }}>
                  {c.price} €
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%', height: 5,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 3, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${barAnim}%`,
                  height: '100%',
                  background: isBest
                    ? `linear-gradient(90deg, ${BLUE_DIM}, ${BLUE})`
                    : 'rgba(255,255,255,0.18)',
                  borderRadius: 3,
                  boxShadow: isBest ? `0 0 8px ${BLUE}88` : undefined,
                }} />
              </div>

              {/* Savings tag for best */}
              {isBest && savings > 0 && (
                <div style={{
                  marginTop: 14,
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: ease(f, delay + 40, delay + 60),
                }}>
                  <div style={{
                    background: 'rgba(52,211,153,0.15)',
                    border: '1px solid rgba(52,211,153,0.30)',
                    color: '#34d399',
                    fontFamily: MONO,
                    fontSize: 16,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 6,
                  }}>
                    −{savings} €
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 16, color: 'rgba(203,213,225,0.50)' }}>
                    par rapport au prix France
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Big savings callout */}
      <div style={{
        marginTop: 40,
        opacity: ease(f, 88, 112) * exitOp,
        transform: `scale(${spr(f, 88, 24, 220)})`,
        display: 'flex', alignItems: 'baseline', gap: 12,
      }}>
        <span style={{
          fontFamily: FONT,
          fontSize: 80,
          fontWeight: 900,
          letterSpacing: '-0.05em',
          color: '#34d399',
          filter: 'drop-shadow(0 0 24px rgba(52,211,153,0.40))',
        }}>
          −{PCT}%
        </span>
        <span style={{ fontFamily: FONT, fontSize: 28, color: MUTED, letterSpacing: '-0.02em' }}>
          d'économie
        </span>
      </div>
    </AbsoluteFill>
  )
}

// ── SCENE 4: FLOATING UI CARD (345–480f = 11.5–16s) ───────────────────────
function SceneCard() {
  const f = useCurrentFrame()

  const cardY   = interpolate(spr(f, 0, 20, 160), [0, 1], [300, 0])
  const cardOp  = ease(f, 0, 25)
  const exitOp  = easeIn(f, 110, 135, 1, 0)
  const glowPulse = Math.sin(f * 0.12) * 0.5 + 0.5

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 48px',
    }}>
      <GlowOrb x={540} y={940} color={BLUE} radius={420} opacity={(0.08 + glowPulse * 0.04) * cardOp * exitOp} />

      <div style={{
        opacity: cardOp * exitOp,
        transform: `translateY(${cardY}px)`,
        width: '100%',
      }}>
        {/* Header eyebrow */}
        <p style={{
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: `rgba(96,165,250,0.65)`,
          marginBottom: 28,
          textAlign: 'center',
        }}>
          EuroCompare — Sony WH-1000XM5
        </p>

        {/* Glass card */}
        <div style={{
          background: 'rgba(13,26,46,0.85)',
          border: `1px solid rgba(59,130,246,0.20)`,
          borderRadius: 28,
          padding: '40px 40px 36px',
          backdropFilter: 'blur(40px)',
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.05),
            0 24px 80px rgba(0,0,0,0.50),
            0 0 80px rgba(59,130,246,0.08)
          `,
        }}>
          {/* Product headline */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: 32,
          }}>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 13, color: `rgba(96,165,250,0.60)`, margin: '0 0 8px', letterSpacing: '0.08em' }}>
                MEILLEUR PRIX TROUVÉ
              </p>
              <p style={{ fontFamily: FONT, fontSize: 40, fontWeight: 800, color: WHITE, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
                259 €
              </p>
              <p style={{ fontFamily: FONT, fontSize: 16, color: MUTED, margin: '6px 0 0', letterSpacing: '-0.01em' }}>
                livraison incluse · vendeur officiel
              </p>
            </div>
            <div style={{
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.25)',
              borderRadius: 12,
              padding: '12px 18px',
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: '#34d399', margin: 0, letterSpacing: '-0.03em' }}>
                −{PCT}%
              </p>
              <p style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(52,211,153,0.60)', margin: '4px 0 0', letterSpacing: '0.06em' }}>
                ÉCONOMIE
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: BORDER, marginBottom: 28 }} />

          {/* Country rows */}
          {COUNTRIES.map((c, i) => (
            <div key={c.code} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              borderRadius: 12,
              background: c.best ? 'rgba(59,130,246,0.08)' : 'transparent',
              marginBottom: i < COUNTRIES.length - 1 ? 8 : 0,
              opacity: ease(f, 28 + i * 12, 44 + i * 12),
            }}>
              <FlagStripes stripes={c.flag} vertical size={22} />
              <span style={{ fontFamily: FONT, fontSize: 20, color: c.best ? WHITE : MUTED, flex: 1, letterSpacing: '-0.01em', fontWeight: c.best ? 600 : 400 }}>
                {c.label}
              </span>
              <span style={{
                fontFamily: FONT, fontSize: 22,
                color: c.best ? BLUE : 'rgba(203,213,225,0.45)',
                fontWeight: c.best ? 700 : 400,
                letterSpacing: '-0.02em',
                filter: c.best ? `drop-shadow(0 0 10px ${BLUE}66)` : undefined,
              }}>
                {c.price} €
              </span>
            </div>
          ))}

          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: BORDER, margin: '28px 0' }} />

          {/* CTA Button */}
          <div style={{
            background: BLUE,
            borderRadius: 16,
            padding: '20px 32px',
            textAlign: 'center',
            opacity: ease(f, 55, 75),
            boxShadow: `0 8px 32px rgba(37,99,235,0.40)`,
          }}>
            <p style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Acheter sur Amazon.es →
            </p>
          </div>
        </div>

        {/* Below card: URL hint */}
        <p style={{
          fontFamily: MONO,
          fontSize: 18,
          color: 'rgba(96,165,250,0.40)',
          textAlign: 'center',
          marginTop: 28,
          opacity: ease(f, 70, 90) * exitOp,
          letterSpacing: '0.05em',
        }}>
          eurocompare.fr
        </p>
      </div>
    </AbsoluteFill>
  )
}

// ── SCENE 5: OUTRO (480–600f = 16–20s) ────────────────────────────────────
function SceneOutro() {
  const f = useCurrentFrame()

  const logoScale = spr(f, 0, 22, 260)
  const logoOp    = ease(f, 0, 20)
  const line1Op   = ease(f, 28, 50)
  const line1Clip = ease(f, 28, 58)
  const line2Op   = ease(f, 52, 72)
  const line2Clip = ease(f, 52, 82)
  const urlOp     = ease(f, 78, 98)
  const lineW     = ease(f, 82, 110, 0, 100)
  const glowPulse = Math.sin(f * 0.10) * 0.5 + 0.5

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 80px',
    }}>
      <GlowOrb x={540} y={920} color={BLUE} radius={380} opacity={(0.12 + glowPulse * 0.06) * logoOp} />
      <GlowOrb x={200} y={700} color="#6366f1" radius={220} opacity={0.06 * ease(f, 30, 65)} />

      {/* Logo mark */}
      <div style={{
        width: 72, height: 72,
        background: `linear-gradient(135deg, ${BLUE_DIM}, ${BLUE})`,
        borderRadius: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 32,
        opacity: logoOp,
        transform: `scale(${logoScale})`,
        boxShadow: `0 0 40px rgba(59,130,246,0.40), 0 0 80px rgba(59,130,246,0.15)`,
      }}>
        <span style={{
          fontFamily: FONT,
          fontSize: 36,
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.06em',
        }}>E</span>
      </div>

      {/* Wordmark */}
      <p style={{
        fontFamily: FONT,
        fontSize: 28,
        fontWeight: 700,
        color: 'rgba(240,244,255,0.55)',
        letterSpacing: '0.01em',
        margin: '0 0 56px',
        opacity: logoOp,
      }}>
        EuroCompare
      </p>

      {/* Tagline line 1 */}
      <div style={{
        overflow: 'hidden',
        clipPath: `inset(0 ${(1 - line1Clip) * 102}% 0 0)`,
        opacity: line1Op,
        marginBottom: 4,
      }}>
        <h2 style={{
          fontFamily: FONT,
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: '-0.045em',
          lineHeight: 1.08,
          color: WHITE,
          margin: 0,
          textAlign: 'center',
        }}>
          Le même produit.
        </h2>
      </div>

      {/* Tagline line 2 */}
      <div style={{
        overflow: 'hidden',
        clipPath: `inset(0 ${(1 - line2Clip) * 102}% 0 0)`,
        opacity: line2Op,
        marginBottom: 60,
      }}>
        <h2 style={{
          fontFamily: FONT,
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: '-0.045em',
          lineHeight: 1.08,
          color: BLUE,
          margin: 0,
          textAlign: 'center',
          filter: `drop-shadow(0 0 24px ${BLUE}66)`,
        }}>
          Moins cher.
        </h2>
      </div>

      {/* URL */}
      <div style={{ opacity: urlOp, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <p style={{
          fontFamily: MONO,
          fontSize: 24,
          color: 'rgba(96,165,250,0.70)',
          letterSpacing: '0.08em',
          margin: 0,
        }}>
          eurocompare.fr
        </p>

        {/* Extending line */}
        <div style={{
          width: `${lineW}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)`,
          borderRadius: 1,
          boxShadow: `0 0 8px ${BLUE}88`,
        }} />
      </div>
    </AbsoluteFill>
  )
}

// ── ROOT COMPOSITION ────────────────────────────────────────────────────────
export const EuroCompareAd: React.FC = () => {
  const f = useCurrentFrame()

  // Global background fade
  const bgOp = ease(f, 0, 12)

  return (
    <AbsoluteFill style={{ background: BG, opacity: bgOp }}>
      {/* Persistent particle layer */}
      <Particles frame={f} />

      {/* Scene 1 — Hook */}
      <Sequence from={0} durationInFrames={80}>
        <SceneHook />
      </Sequence>

      {/* Scene 2 — Big Price */}
      <Sequence from={72} durationInFrames={120}>
        <SceneBigPrice />
      </Sequence>

      {/* Scene 3 — Compare */}
      <Sequence from={175} durationInFrames={172}>
        <SceneCompare />
      </Sequence>

      {/* Scene 4 — Floating Card */}
      <Sequence from={340} durationInFrames={148}>
        <SceneCard />
      </Sequence>

      {/* Scene 5 — Outro */}
      <Sequence from={478} durationInFrames={122}>
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  )
}
