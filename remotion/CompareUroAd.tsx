'use client'
import { ThreeCanvas } from '@remotion/three'
import { useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'
import {
  AbsoluteFill, Easing, Sequence,
  interpolate, spring, useCurrentFrame,
} from 'remotion'

// ── Brand tokens ─────────────────────────────────────────────────────────────
const BG       = '#060c18'
const BLUE     = '#2563eb'
const BLUE_LT  = '#3b82f6'
const BLUE_DIM = '#1d4ed8'
const WHITE    = '#f0f4ff'
const MUTED    = 'rgba(203,213,225,0.58)'
const BORDER   = 'rgba(255,255,255,0.08)'
const GREEN    = '#4ade80'
const FONT     = '"Geist","Inter",-apple-system,BlinkMacSystemFont,sans-serif'
const MONO     = '"Geist Mono","JetBrains Mono","SF Mono",monospace'

const COUNTRIES = [
  { code: 'FR', tld: 'fr', label: 'Amazon.fr', price: 349, flag: ['#002395', '#f0f4ff', '#ED2939'] },
  { code: 'DE', tld: 'de', label: 'Amazon.de', price: 289, flag: ['#1a1a1a', '#cc0000', '#ffce00'] },
  { code: 'ES', tld: 'es', label: 'Amazon.es', price: 259, flag: ['#c60b1e', '#ffc400', '#c60b1e'], best: true },
] as const

const MAX = 349, SAVE = 90, PCT = 26

// ── Logo geometry (copié de compareuroLogo.tsx) ──────────────────────────────
const STAR_R    = 42
const STAR_SIZE = 4.2
const LA = 17, LB = 33

const LOGO_ARROWS = [
  { d: `M ${50-4} ${50-4} Q ${LB-5} ${LA+8} ${LA} ${LA}`,                   hx: LA,     hy: LA,     hang: -135 },
  { d: `M ${50+4} ${50-4} Q ${100-LB+5} ${LA+8} ${100-LA} ${LA}`,           hx: 100-LA, hy: LA,     hang: -45  },
  { d: `M ${50+4} ${50+4} Q ${100-LB+5} ${100-LA-8} ${100-LA} ${100-LA}`,   hx: 100-LA, hy: 100-LA, hang: 45   },
  { d: `M ${50-4} ${50+4} Q ${LB-5} ${100-LA-8} ${LA} ${100-LA}`,           hx: LA,     hy: 100-LA, hang: 135  },
]

function computeStarPoints() {
  const s: { x: number; y: number }[] = []
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2
    s.push({ x: 50 + STAR_R * Math.cos(a), y: 50 + STAR_R * Math.sin(a) })
  }
  return s
}
const LOGO_STARS = computeStarPoints()

function StarShape({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const a  = (i / 10) * Math.PI * 2 - Math.PI / 2
    const rr = i % 2 === 0 ? r : r * 0.45
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(4)},${(cy + rr * Math.sin(a)).toFixed(4)}`)
  }
  return <polygon points={pts.join(' ')} fill={fill} />
}

// Logo animé (flèches + étoiles + wordmark)
function AnimatedLogo({
  size = 120,
  arrowProg = 1,
  starsProg = 1,
  textOp = 1,
  subtitleOp = 0,
}: {
  size?: number
  arrowProg?: number
  starsProg?: number
  textOp?: number
  subtitleOp?: number
}) {
  const DASH = 100
  const headOp = arrowProg > 0.85 ? (arrowProg - 0.85) / 0.15 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        {LOGO_ARROWS.map((a, i) => (
          <g key={i}>
            <path
              d={a.d} stroke={WHITE} strokeWidth="6" fill="none" strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={DASH * (1 - arrowProg)}
            />
            <g transform={`translate(${a.hx} ${a.hy}) rotate(${a.hang})`} style={{ opacity: headOp }}>
              <polygon points="0,0 10,4 10,-4" fill={WHITE} />
            </g>
          </g>
        ))}
        {LOGO_STARS.map((s, i) => {
          const localProg = Math.max(0, Math.min(1, (starsProg - (i / 12) * 0.55) * 2.5))
          return (
            <g key={i} style={{ opacity: localProg, transform: `scale(${0.6 + 0.4 * localProg})`, transformOrigin: `${s.x}px ${s.y}px` }}>
              <StarShape cx={s.x} cy={s.y} r={STAR_SIZE} fill={BLUE_LT} />
            </g>
          )
        })}
      </svg>

      <div style={{ textAlign: 'center', opacity: textOp }}>
        <div style={{ fontFamily: FONT, fontSize: size * 0.38, fontWeight: 800, letterSpacing: '-0.03em', color: WHITE, lineHeight: 1 }}>
          CompareUro
        </div>
        {subtitleOp > 0 && (
          <div style={{ fontFamily: MONO, fontSize: size * 0.14, letterSpacing: '0.18em', textTransform: 'uppercase', color: `rgba(96,165,250,0.65)`, marginTop: 10, opacity: subtitleOp }}>
            Comparateur Amazon Europe
          </div>
        )}
      </div>
    </div>
  )
}

// ── Animation helpers ─────────────────────────────────────────────────────────
const spr = (f: number, delay = 0, damping = 16, stiffness = 160) =>
  spring({ frame: Math.max(0, f - delay), fps: 30, config: { damping, stiffness, mass: 1 } })

const ease = (f: number, i: number, o: number, from = 0, to = 1) =>
  interpolate(f, [i, o], [from, to], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

const easeIn = (f: number, i: number, o: number, from = 0, to = 1) =>
  interpolate(f, [i, o], [from, to], {
    easing: Easing.bezier(0.55, 0, 1, 0.45),
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

const countNum = (f: number, i: number, o: number, from: number, to: number) =>
  Math.round(interpolate(f, [i, o], [from, to], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }))

// ── THREE.js — géométrie cachée au niveau module ──────────────────────────────
const _particleCount = 700
const _particlePositions = (() => {
  const arr = new Float32Array(_particleCount * 3)
  for (let i = 0; i < _particleCount; i++) {
    const phi   = Math.acos(1 - 2 * i / _particleCount)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const r     = 7 + (i % 4) * 0.9
    arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.cos(phi)
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2
  }
  return arr
})()
const _ptGeo = (() => {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(_particlePositions.slice(), 3))
  return g
})()

const _planeCache: Record<string, THREE.PlaneGeometry>  = {}
const _edgesCache: Record<string, THREE.EdgesGeometry>  = {}
const getPlane = (w: number, h: number) => {
  const k = `${w}x${h}`
  if (!_planeCache[k]) _planeCache[k] = new THREE.PlaneGeometry(w, h)
  return _planeCache[k]
}
const getEdges = (w: number, h: number) => {
  const k = `${w}x${h}`
  if (!_edgesCache[k]) _edgesCache[k] = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.01))
  return _edgesCache[k]
}

// ── THREE.js components ───────────────────────────────────────────────────────

function CameraRig({ frame }: { frame: number }) {
  const { camera } = useThree()
  let x = 0, y = 0, z = 12

  if (frame < 95) {
    z = ease(frame, 0, 90, 22, 7)
    y = ease(frame, 0, 90, 0.8, 0)
  } else if (frame < 200) {
    z = ease(frame, 95, 180, 7, 10)
    y = ease(frame, 95, 180, 0, 0.3)
  } else if (frame < 375) {
    const t = (frame - 200) / 175
    x = Math.sin(t * Math.PI * 0.9) * 2.0
    y = Math.sin(t * Math.PI * 0.45) * 0.6
    z = 10
  } else if (frame < 490) {
    x = ease(frame, 360, 490, 0, 1.2)
    y = ease(frame, 360, 490, 0.5, -0.8)
    z = ease(frame, 360, 430, 12, 6.5)
  } else {
    z = ease(frame, 478, 600, 7, 14)
    y = ease(frame, 478, 600, 0, 0.5)
  }

  camera.position.set(x, y, z)
  camera.lookAt(0, 0, 0)
  return null
}

function SceneLighting({ frame }: { frame: number }) {
  const op = ease(frame, 0, 20)
  return (
    <>
      <ambientLight intensity={0.22 * op} color="#101830" />
      <pointLight position={[0, 2, 6]}   intensity={2.0 * op} color={BLUE}    distance={30} />
      <pointLight position={[5, 4, 3]}   intensity={0.7 * op} color="#6366f1" distance={22} />
      <pointLight position={[-4, -3, 4]} intensity={0.5 * op} color={BLUE_LT} distance={20} />
      <hemisphereLight args={['#1a2340', '#060c18', 0.38 * op]} />
    </>
  )
}

function ParticleField({ frame }: { frame: number }) {
  return (
    <points geometry={_ptGeo} rotation={[frame * 0.0028, frame * 0.0042, frame * 0.0015]}>
      <pointsMaterial size={0.04} color={BLUE_LT} opacity={0.28 * ease(frame, 0, 30)} transparent sizeAttenuation />
    </points>
  )
}

function GlowCard({ position, width, height, opacity, glowColor = BLUE, tiltX = 0, tiltY = 0 }: {
  position: [number, number, number]; width: number; height: number; opacity: number
  glowColor?: string; tiltX?: number; tiltY?: number
}) {
  if (opacity <= 0) return null
  return (
    <group position={position} rotation={[tiltX, tiltY, 0]}>
      <mesh geometry={getPlane(width, height)}>
        <meshStandardMaterial color="#080e1c" transparent opacity={opacity * 0.88} side={THREE.FrontSide} />
      </mesh>
      <lineSegments geometry={getEdges(width, height)}>
        <lineBasicMaterial color={glowColor} transparent opacity={opacity * 0.55} />
      </lineSegments>
    </group>
  )
}

function ConceptCards({ frame }: { frame: number }) {
  const lf = frame - 200
  return (
    <>
      {COUNTRIES.map((c, i) => {
        const yPos  = (1 - i) * 3.6
        const cardOp = ease(lf - i * 16, 0, 18)
        const tiltY  = Math.sin(lf * 0.016) * 0.07
        const isBest = 'best' in c && c.best === true
        return (
          <GlowCard key={c.code} position={[0, yPos, 0]} width={5.7} height={2.8}
            opacity={cardOp} glowColor={isBest ? BLUE : '#1e3a5f'} tiltY={tiltY} />
        )
      })}
    </>
  )
}

function ResultCards({ frame }: { frame: number }) {
  const lf = frame - 360
  return (
    <>
      <GlowCard position={[0, 0, 0]} width={5.7} height={10} opacity={ease(lf, 0, 22)}
        tiltX={Math.sin(lf * 0.025) * 0.04} tiltY={Math.sin(lf * 0.018) * 0.055} />
      <GlowCard position={[-5.5, 2.5, -3.5]} width={3.2} height={2.2}
        opacity={ease(lf, 8, 28) * 0.36} glowColor="#6366f1" tiltY={0.24} />
      <GlowCard position={[5.5, -2.5, -3.5]} width={3.2} height={2.2}
        opacity={ease(lf, 8, 28) * 0.34} tiltY={-0.22} />
    </>
  )
}

function World({ frame }: { frame: number }) {
  return (
    <>
      <CameraRig frame={frame} />
      <SceneLighting frame={frame} />
      <Stars radius={28} depth={55} count={2800} factor={3.5} saturation={0} fade speed={0} />
      <ParticleField frame={frame} />
      {frame >= 200 && frame < 380 && <ConceptCards frame={frame} />}
      {frame >= 360 && frame < 492 && <ResultCards frame={frame} />}
    </>
  )
}

// ── DOM — utilitaires ─────────────────────────────────────────────────────────

const PTS = Array.from({ length: 45 }, (_, i) => ({
  x: (i * 137.508) % 1080, y: (i * 233.718) % 1920,
  r: 0.8 + (i % 3) * 0.4, op: 0.03 + (i % 5) * 0.02, dy: 0.15 + (i % 7) * 0.06,
}))

function CSSParticles({ frame }: { frame: number }) {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {PTS.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.x,
          top: ((p.y - frame * p.dy * 0.4) % 1920 + 1920) % 1920,
          width: p.r * 2, height: p.r * 2, borderRadius: '50%',
          background: BLUE_LT, opacity: p.op,
        }} />
      ))}
    </AbsoluteFill>
  )
}

function Glow({ x, y, color, r, op }: { x: number; y: number; color: string; r: number; op: number }) {
  return (
    <div style={{
      position: 'absolute', left: x - r, top: y - r,
      width: r * 2, height: r * 2, borderRadius: '50%',
      background: `radial-gradient(circle at center,${color}44 0%,${color}00 68%)`,
      opacity: op, pointerEvents: 'none',
    }} />
  )
}

function Flag({ stripes, size = 28 }: { stripes: readonly string[]; size?: number }) {
  return (
    <div style={{
      width: size * 1.42, height: size, borderRadius: 4, overflow: 'hidden',
      display: 'flex', border: '1px solid rgba(255,255,255,0.11)', flexShrink: 0,
    }}>
      {stripes.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
    </div>
  )
}

function Beam({ y, op }: { y: number; op: number }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: y - 1, height: 2,
      background: `linear-gradient(90deg,transparent,${BLUE}cc 20%,${BLUE} 50%,${BLUE}cc 80%,transparent)`,
      boxShadow: `0 0 18px 4px ${BLUE}66,0 0 50px 10px ${BLUE}1a`,
      opacity: op, pointerEvents: 'none',
    }} />
  )
}

// ── SCÈNE 1 : LOGO INTRO (0–95f) ─────────────────────────────────────────────
function DOMLogoIntro({ frame: f }: { frame: number }) {
  const arrowProg  = ease(f, 8, 52)
  const starsProg  = ease(f, 45, 80)
  const textOp     = ease(f, 65, 84)
  const subtitleOp = ease(f, 72, 90)
  const containerOp = easeIn(f, 80, 95, 1, 0)
  const containerSc = 1 + ease(f, 78, 95, 0, 0.04)

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Glow x={540} y={960} color={BLUE} r={480} op={0.14 * ease(f, 5, 35)} />
      <div style={{ opacity: containerOp, transform: `scale(${containerSc})` }}>
        <AnimatedLogo
          size={160}
          arrowProg={arrowProg}
          starsProg={starsProg}
          textOp={textOp}
          subtitleOp={subtitleOp}
        />
      </div>
    </AbsoluteFill>
  )
}

// ── SCÈNE 2 : LE CONCEPT (88–200f) ───────────────────────────────────────────
function DOMConcept({ frame: f }: { frame: number }) {
  const exit = easeIn(f, 88, 100, 1, 0)

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 60px' }}>
      <Glow x={540} y={880} color={BLUE} r={400} op={0.10 * ease(f, 10, 40)} />

      {/* Eyebrow */}
      <div style={{ overflow: 'hidden', marginBottom: 20 }}>
        <p style={{
          fontFamily: MONO, fontSize: 16, letterSpacing: '0.20em', textTransform: 'uppercase',
          color: `rgba(96,165,250,0.68)`, margin: 0,
          transform: `translateY(${(1 - ease(f, 0, 22)) * 100}%)`,
          opacity: ease(f, 0, 22) * exit,
        }}>Le même produit</p>
      </div>

      {/* Titre */}
      <div style={{ overflow: 'hidden', marginBottom: 6 }}>
        <h1 style={{
          fontFamily: FONT, fontSize: 76, fontWeight: 800, letterSpacing: '-0.05em',
          lineHeight: 1.06, color: WHITE, margin: 0, textAlign: 'center',
          transform: `translateY(${(1 - ease(f, 6, 28)) * 100}%)`,
          opacity: ease(f, 6, 28) * exit,
        }}>Existe sur 3 Amazons.</h1>
      </div>
      <div style={{ overflow: 'hidden', marginBottom: 56 }}>
        <h1 style={{
          fontFamily: FONT, fontSize: 76, fontWeight: 800, letterSpacing: '-0.05em',
          lineHeight: 1.06, color: BLUE, margin: 0, textAlign: 'center',
          filter: `drop-shadow(0 0 22px ${BLUE}77)`,
          transform: `translateY(${(1 - ease(f, 16, 38)) * 100}%)`,
          opacity: ease(f, 16, 38) * exit,
        }}>À des prix différents.</h1>
      </div>

      {/* 3 country blocks */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {COUNTRIES.map((c, i) => {
          const d      = i * 14
          const rowSpr = spr(f, 30 + d, 18, 160)
          const rowOp  = ease(f, 30 + d, 48 + d)
          const isBest = 'best' in c && c.best === true

          return (
            <div key={c.code} style={{
              opacity: rowOp * exit,
              transform: `translateY(${(1 - rowSpr) * 40}px)`,
              background: isBest ? 'rgba(37,99,235,0.08)' : 'rgba(12,24,44,0.75)',
              border: isBest ? `1px solid ${BLUE}44` : `1px solid ${BORDER}`,
              borderRadius: 18, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 18,
              backdropFilter: 'blur(20px)',
            }}>
              <Flag stripes={c.flag} size={34} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, color: isBest ? WHITE : MUTED, margin: 0, letterSpacing: '-0.02em' }}>
                  {c.label}
                </p>
                <p style={{ fontFamily: MONO, fontSize: 12, color: `rgba(96,165,250,0.50)`, margin: '3px 0 0', letterSpacing: '0.05em' }}>
                  amazon.{c.tld}
                </p>
              </div>
              {isBest && (
                <div style={{ background: BLUE, color: '#fff', fontFamily: MONO, fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.08em' }}>
                  MEILLEUR PRIX
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tagline bas */}
      <p style={{
        fontFamily: FONT, fontSize: 18, color: MUTED, textAlign: 'center',
        marginTop: 36, letterSpacing: '-0.01em', lineHeight: 1.6,
        opacity: ease(f, 65, 82) * exit,
      }}>
        L'écart peut atteindre <strong style={{ color: WHITE }}>26%</strong> sur le même produit.
      </p>
    </AbsoluteFill>
  )
}

// ── SCÈNE 3 : SCAN EN ACTION (192–370f) ───────────────────────────────────────
function DOMScan({ frame: f }: { frame: number }) {
  const exit = easeIn(f, 150, 165, 1, 0)

  // Typing animation pour "Sony WH-1000XM5"
  const QUERY  = 'Sony WH-1000XM5'
  const typed  = Math.floor(ease(f, 8, 36, 0, QUERY.length))
  const queryOp = ease(f, 6, 22)

  // Phases du scan
  const scanLine1 = ease(f, 40, 55)   // "Scan Amazon.fr"
  const scanLine2 = ease(f, 55, 70)   // "Scan Amazon.de"
  const scanLine3 = ease(f, 70, 85)   // "Scan Amazon.es"
  const resultsOp = ease(f, 88, 105)  // résultats apparaissent

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 50px' }}>
      <Glow x={540} y={860} color={BLUE} r={380} op={0.09 * ease(f, 15, 45)} />

      {/* Eyebrow */}
      <div style={{ overflow: 'hidden', marginBottom: 16 }}>
        <p style={{
          fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: `rgba(96,165,250,0.68)`, margin: 0,
          transform: `translateY(${(1 - ease(f, 0, 18)) * 100}%)`,
          opacity: ease(f, 0, 18) * exit,
        }}>CompareUro scanne pour vous</p>
      </div>

      {/* Search bar animée */}
      <div style={{
        width: '100%',
        background: 'rgba(12,24,44,0.90)',
        border: `1.5px solid ${BLUE}55`,
        borderRadius: 16, padding: '18px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 32,
        opacity: queryOp * exit,
        boxShadow: `0 0 32px rgba(37,99,235,0.15)`,
        backdropFilter: 'blur(20px)',
      }}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={BLUE_LT} strokeWidth={2.5} strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span style={{ fontFamily: MONO, fontSize: 20, color: WHITE, letterSpacing: '-0.01em', flex: 1 }}>
          {QUERY.slice(0, typed)}
          <span style={{ opacity: Math.sin(f * 0.35) > 0 ? 1 : 0, color: BLUE_LT }}>|</span>
        </span>
      </div>

      {/* Scan lines */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, opacity: exit }}>
        {[
          { label: 'Scan Amazon.fr', flag: COUNTRIES[0].flag, prog: scanLine1 },
          { label: 'Scan Amazon.de', flag: COUNTRIES[1].flag, prog: scanLine2 },
          { label: 'Scan Amazon.es', flag: COUNTRIES[2].flag, prog: scanLine3 },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: ease(f, 36 + i * 15, 52 + i * 15) }}>
            <Flag stripes={row.flag} size={20} />
            <span style={{ fontFamily: MONO, fontSize: 14, color: MUTED, flex: 1, letterSpacing: '0.04em' }}>{row.label}</span>
            <div style={{ width: 140, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: `${row.prog * 100}%`, height: '100%',
                background: `linear-gradient(90deg,${BLUE_DIM},${BLUE_LT})`,
                borderRadius: 2, boxShadow: `0 0 6px ${BLUE}aa`,
                transition: 'none',
              }} />
            </div>
            {row.prog >= 0.98 && (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2.5} strokeLinecap="round" style={{ opacity: ease(f, 36 + i * 15 + 18, 36 + i * 15 + 28) }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Résultats */}
      <div style={{ width: '100%', opacity: resultsOp * exit }}>
        <p style={{ fontFamily: MONO, fontSize: 13, color: `rgba(96,165,250,0.55)`, margin: '0 0 14px', letterSpacing: '0.10em', textAlign: 'center' }}>
          RÉSULTATS TROUVÉS — 3 MARCHÉS
        </p>
        {COUNTRIES.map((c, i) => {
          const isBest = 'best' in c && c.best === true
          return (
            <div key={c.code} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
              borderRadius: 14,
              background: isBest ? 'rgba(37,99,235,0.10)' : 'transparent',
              border: isBest ? `1px solid ${BLUE}44` : `1px solid ${BORDER}`,
              marginBottom: i < COUNTRIES.length - 1 ? 8 : 0,
              opacity: ease(f, 90 + i * 10, 105 + i * 10),
            }}>
              <Flag stripes={c.flag} size={24} />
              <span style={{ fontFamily: FONT, fontSize: 18, color: isBest ? WHITE : MUTED, flex: 1, fontWeight: isBest ? 600 : 400 }}>{c.label}</span>
              {isBest && <div style={{ background: BLUE, color: '#fff', fontFamily: MONO, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, letterSpacing: '0.08em' }}>BEST</div>}
              <span style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: isBest ? BLUE : WHITE, letterSpacing: '-0.04em', filter: isBest ? `drop-shadow(0 0 12px ${BLUE}88)` : undefined }}>
                {c.price} €
              </span>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

// ── SCÈNE 4 : LE RÉSULTAT (360–490f) ─────────────────────────────────────────
function DOMResultat({ frame: f }: { frame: number }) {
  const cardOp = ease(f, 0, 22)
  const exit   = easeIn(f, 110, 130, 1, 0)
  const bobY   = Math.sin(f * 0.078) * 11
  const tiltX  = Math.sin(f * 0.058) * 2.4
  const tiltY  = Math.cos(f * 0.068) * 1.4
  const pulse  = Math.sin(f * 0.10) * 0.5 + 0.5

  // Économies qui comptent
  const savingsCount = countNum(f, 18, 52, 0, SAVE)

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
      <Glow x={540} y={920} color={BLUE} r={460} op={(0.08 + pulse * 0.05) * cardOp * exit} />

      <div style={{
        opacity: cardOp * exit,
        transform: `translateY(${bobY}px) perspective(1500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        width: '100%', willChange: 'transform',
      }}>
        {/* Eyebrow */}
        <div style={{ overflow: 'hidden', marginBottom: 16, textAlign: 'center' }}>
          <p style={{ fontFamily: MONO, fontSize: 14, letterSpacing: '0.20em', textTransform: 'uppercase', color: `rgba(96,165,250,0.65)`, margin: 0, transform: `translateY(${(1 - ease(f, 0, 18)) * 100}%)`, opacity: ease(f, 0, 18) }}>
            Vous économisez
          </p>
        </div>

        {/* Gros chiffre d'économies */}
        <div style={{ textAlign: 'center', marginBottom: 40, opacity: ease(f, 8, 24) }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: FONT, fontSize: 130, fontWeight: 900, color: GREEN, letterSpacing: '-0.06em', lineHeight: 1, filter: 'drop-shadow(0 0 36px rgba(74,222,128,0.50))' }}>
              {savingsCount}€
            </span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 22, color: MUTED, margin: '4px 0 0', letterSpacing: '-0.01em', opacity: ease(f, 20, 36) }}>
            sur ce produit, livraison incluse
          </p>
        </div>

        {/* Card produit */}
        <div style={{ background: 'rgba(8,20,40,0.93)', border: `1px solid rgba(37,99,235,0.20)`, borderRadius: 26, padding: '30px 30px 26px', backdropFilter: 'blur(40px)', boxShadow: `0 0 0 1px rgba(255,255,255,0.04),0 32px 100px rgba(0,0,0,0.58),0 0 80px rgba(37,99,235,0.10)` }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 10, color: `rgba(96,165,250,0.50)`, margin: '0 0 7px', letterSpacing: '0.11em', opacity: ease(f, 14, 28) }}>MEILLEUR PRIX TROUVÉ</p>
              <p style={{ fontFamily: FONT, fontSize: 42, fontWeight: 900, color: BLUE, margin: 0, letterSpacing: '-0.055em', lineHeight: 1, filter: `drop-shadow(0 0 16px ${BLUE}66)`, opacity: ease(f, 18, 32) }}>259 €</p>
              <p style={{ fontFamily: FONT, fontSize: 13, color: MUTED, margin: '4px 0 0', opacity: ease(f, 26, 40) }}>livraison incluse · vendeur officiel</p>
            </div>
            <div style={{ background: 'rgba(74,222,128,0.09)', border: '1px solid rgba(74,222,128,0.20)', borderRadius: 12, padding: '10px 14px', textAlign: 'center', opacity: ease(f, 26, 42) }}>
              <p style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: GREEN, margin: 0, letterSpacing: '-0.04em' }}>−{PCT}%</p>
              <p style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(74,222,128,0.52)', margin: '3px 0 0', letterSpacing: '0.09em' }}>ÉCONOMIE</p>
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: BORDER, marginBottom: 18 }} />

          {COUNTRIES.map((c, i) => (
            <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'best' in c && c.best ? `rgba(37,99,235,0.09)` : 'transparent', marginBottom: i < COUNTRIES.length - 1 ? 4 : 0, opacity: ease(f, 22 + i * 10, 38 + i * 10) }}>
              <Flag stripes={c.flag} size={20} />
              <span style={{ fontFamily: FONT, fontSize: 16, flex: 1, color: 'best' in c && c.best ? WHITE : MUTED, fontWeight: 'best' in c && c.best ? 600 : 400 }}>{c.label}</span>
              <span style={{ fontFamily: FONT, fontSize: 18, color: 'best' in c && c.best ? BLUE : 'rgba(203,213,225,0.38)', fontWeight: 'best' in c && c.best ? 700 : 400, filter: 'best' in c && c.best ? `drop-shadow(0 0 10px ${BLUE}66)` : undefined }}>{c.price} €</span>
            </div>
          ))}

          <div style={{ width: '100%', height: 1, background: BORDER, margin: '18px 0' }} />

          <div style={{ background: BLUE, borderRadius: 13, padding: '16px 24px', textAlign: 'center', opacity: ease(f, 52, 66), boxShadow: `0 8px 28px rgba(37,99,235,0.46),inset 0 1px 0 rgba(255,255,255,0.14)` }}>
            <p style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Voir sur Amazon.es →</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ── SCÈNE 5 : OUTRO (478–600f) ────────────────────────────────────────────────
function DOMOutro({ frame: f }: { frame: number }) {
  const arrowProg = ease(f, 4, 36)
  const starsProg = ease(f, 28, 58)
  const textOp    = ease(f, 48, 64)
  const tagOp1    = ease(f, 62, 80)
  const tagOp2    = ease(f, 74, 92)
  const urlOp     = ease(f, 88, 104)
  const beamW     = ease(f, 94, 120, 0, 100)
  const pulse     = Math.sin(f * 0.09) * 0.5 + 0.5

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px' }}>
      <Glow x={540} y={820} color={BLUE} r={460} op={(0.10 + pulse * 0.07) * ease(f, 0, 20)} />

      {/* Logo animé (version rapide) */}
      <div style={{ marginBottom: 16 }}>
        <AnimatedLogo size={110} arrowProg={arrowProg} starsProg={starsProg} textOp={textOp} />
      </div>

      {/* Tagline */}
      <div style={{ overflow: 'hidden', marginBottom: 2, marginTop: 48 }}>
        <h2 style={{ fontFamily: FONT, fontSize: 78, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.06, color: WHITE, margin: 0, textAlign: 'center', transform: `translateY(${(1 - tagOp1) * 110}%)`, opacity: Math.min(1, tagOp1 * 1.4) }}>
          Le même produit.
        </h2>
      </div>
      <div style={{ overflow: 'hidden', marginBottom: 60 }}>
        <h2 style={{ fontFamily: FONT, fontSize: 78, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.06, color: BLUE, margin: 0, textAlign: 'center', filter: `drop-shadow(0 0 24px ${BLUE}66)`, transform: `translateY(${(1 - tagOp2) * 110}%)`, opacity: Math.min(1, tagOp2 * 1.4) }}>
          Moins cher.
        </h2>
      </div>

      {/* CTA + URL */}
      <div style={{ opacity: urlOp, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ background: BLUE, borderRadius: 14, padding: '18px 40px', boxShadow: `0 8px 32px rgba(37,99,235,0.48),inset 0 1px 0 rgba(255,255,255,0.16)` }}>
          <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Essayer gratuitement →
          </p>
        </div>
        <p style={{ fontFamily: MONO, fontSize: 20, color: `rgba(96,165,250,0.68)`, letterSpacing: '0.09em', margin: 0 }}>
          compareuro.com
        </p>
        <div style={{ width: `${beamW}%`, height: 2, background: `linear-gradient(90deg,transparent,${BLUE}cc,${BLUE},${BLUE}cc,transparent)`, borderRadius: 1, boxShadow: `0 0 14px ${BLUE}99,0 0 28px ${BLUE}44` }} />
      </div>
    </AbsoluteFill>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export const CompareUroAd: React.FC = () => {
  const f = useCurrentFrame()

  return (
    <AbsoluteFill style={{ background: BG }}>

      {/* LAYER 1 — Three.js 3D */}
      <AbsoluteFill>
        <ThreeCanvas
          width={1080}
          height={1920}
          frameloop="always"
          camera={{ position: [0, 0, 12], fov: 55 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <World frame={f} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* LAYER 2 — Particules CSS */}
      <CSSParticles frame={f} />

      {/* LAYER 3 — Scènes DOM */}
      <AbsoluteFill style={{ opacity: ease(f, 0, 10) }}>

        {/* S1 : Logo intro */}
        <Sequence from={0} durationInFrames={95}>
          <DOMLogoIntro frame={f} />
        </Sequence>

        {/* S2 : Le concept */}
        <Sequence from={88} durationInFrames={112}>
          <DOMConcept frame={f - 88} />
        </Sequence>

        {/* S3 : Scan en action */}
        <Sequence from={192} durationInFrames={178}>
          <DOMScan frame={f - 192} />
        </Sequence>

        {/* S4 : Le résultat */}
        <Sequence from={360} durationInFrames={130}>
          <DOMResultat frame={f - 360} />
        </Sequence>

        {/* S5 : Outro */}
        <Sequence from={478} durationInFrames={122}>
          <DOMOutro frame={f - 478} />
        </Sequence>

      </AbsoluteFill>
    </AbsoluteFill>
  )
}
