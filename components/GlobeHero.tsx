"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { GLOBE_VERT, GLOBE_FRAG, ATMO_VERT, ATMO_INNER, ATMO_OUTER } from "./globe-shaders"

interface Country {
  code: string; name: string; lat: number; lon: number;
  color: string; market: string; tagline: string;
}

const COUNTRIES: Country[] = [
  { code: "FR", name: "France",    lat: 46.2276, lon:   2.2137, color: "#2563eb", market: "Amazon.fr", tagline: "Livraison Prime incluse"  },
  { code: "DE", name: "Allemagne", lat: 51.1657, lon:  10.4515, color: "#f59e0b", market: "Amazon.de", tagline: "Souvent le meilleur prix" },
  { code: "ES", name: "Espagne",   lat: 40.4637, lon:  -3.7492, color: "#dc2626", market: "Amazon.es", tagline: "Avantages TVA européenne" },
]

const SCROLL_RANGE = 2800

// earth.jpg (Three.js CDN, 2048×1024): U=0 = International Date Line.
// offset.x=0.5 shifts Prime Meridian to the sphere front at rotation.y=0.
// Verified: rotation.y = -(lon×π/180) correctly targets FR/DE/ES with this offset.
// East = +X in toXYZ, consistent with this UV convention.
const TEXTURE_OFFSET = 0.5

function toXYZ(lat: number, lon: number, r = 1.0) {
  const la = lat * Math.PI / 180, lo = lon * Math.PI / 180
  return { x: r * Math.cos(la) * Math.sin(lo), y: r * Math.sin(la), z: r * Math.cos(la) * Math.cos(lo) }
}

export default function GlobeHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const hintRef    = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Country | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas  = canvasRef.current
    const section = sectionRef.current
    const wrapper = wrapperRef.current
    const hint    = hintRef.current
    if (!canvas || !section || !wrapper) return
    let disposed = false

    ;(async () => {
      const THREE = await import("three")
      if (disposed) return

      const W   = canvas.clientWidth  || window.innerWidth
      const H   = canvas.clientHeight || window.innerHeight
      // DPR capped at 2 — balance between sharpness and performance
      const dpr = Math.min(window.devicePixelRatio, 2)

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(dpr)
      renderer.setSize(W, H, false)
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100)

      const cam = { z: 2.8, y: 0.6, lookY: 0.15 }
      const applyCamera = () => { camera.position.set(0, cam.y, cam.z); camera.lookAt(0, cam.lookY, 0) }
      applyCamera()

      // gp.x = 0.38: north pole tilts toward viewer, shows northern hemisphere
      const gp = { y: -(10 * Math.PI / 180), x: 0.38 }

      const globeGroup = new THREE.Group()
      scene.add(globeGroup)

      // ── Texture (earth.jpg — confirmed correct orientation) ───────────────
      const loader = new THREE.TextureLoader()
      loader.crossOrigin = "anonymous"
      const tryLoad = (url: string) =>
        new Promise<InstanceType<typeof THREE.Texture>>((ok, fail) => loader.load(url, ok, undefined, fail))

      let earthTex: InstanceType<typeof THREE.Texture>
      try { earthTex = await tryLoad("/globe/earth.jpg") } catch {
        const c = document.createElement("canvas"); c.width = c.height = 4
        const ctx = c.getContext("2d")!; ctx.fillStyle = "#0a0f1e"; ctx.fillRect(0, 0, 4, 4)
        earthTex = new THREE.CanvasTexture(c)
      }
      if (disposed) { renderer.dispose(); return }

      earthTex.wrapS      = THREE.RepeatWrapping
      earthTex.offset.x   = TEXTURE_OFFSET
      earthTex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      earthTex.colorSpace = THREE.SRGBColorSpace

      // ── Globe (96 segments — good quality, 44% less geometry than 128) ────
      const sphereGeo = new THREE.SphereGeometry(1, 96, 96)
      const sphereMat = new THREE.ShaderMaterial({
        vertexShader: GLOBE_VERT, fragmentShader: GLOBE_FRAG,
        uniforms: {
          earthTex:  { value: earthTex },
          lightDir:  { value: new THREE.Vector3(-0.4, 0.6, 1.5).normalize() },
          texelSize: { value: new THREE.Vector2(1 / 2048, 1 / 1024) },
        },
      })
      globeGroup.add(new THREE.Mesh(sphereGeo, sphereMat))

      // ── Atmosphere (two thin realistic layers) ────────────────────────────
      const mkAtmo = (r: number, frag: string) =>
        new THREE.Mesh(new THREE.SphereGeometry(r, 48, 48), new THREE.ShaderMaterial({
          vertexShader: ATMO_VERT, fragmentShader: frag,
          side: THREE.FrontSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
        }))
      const atmoA = mkAtmo(1.05, ATMO_INNER)
      const atmoB = mkAtmo(1.20, ATMO_OUTER)
      scene.add(atmoA); scene.add(atmoB)

      // ── Country markers (white hairline crosshairs) ───────────────────────
      const markerAnims: gsap.core.Tween[] = []
      COUNTRIES.forEach((c) => {
        const pos = toXYZ(c.lat, c.lon, 1.028)
        const g   = new THREE.Group()
        g.position.set(pos.x, pos.y, pos.z); g.lookAt(0, 0, 0); g.rotateX(Math.PI)

        // Tiny center dot
        g.add(new THREE.Mesh(
          new THREE.CircleGeometry(0.006, 10),
          new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
        ))
        // Hairline cross
        const s = 0.018
        const crossGeo = new THREE.BufferGeometry()
        crossGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-s, 0, 0, s, 0, 0, 0, -s, 0, 0, s, 0]), 3))
        const crossMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false })
        g.add(new THREE.LineSegments(crossGeo, crossMat))
        markerAnims.push(gsap.to(crossMat, { opacity: 0.25, duration: 2.0, ease: "sine.inOut", yoyo: true, repeat: -1 }))

        globeGroup.add(g)
      })

      // ── Stars (single layer — simpler, better perf) ───────────────────────
      const starCount = 200
      const starPos = new Float32Array(starCount * 3)
      for (let i = 0; i < starCount; i++) {
        const u = Math.random(), v = Math.random()
        const theta = u * Math.PI * 2, phi = Math.acos(2 * v - 1), r = 28
        starPos[i*3] = r*Math.sin(phi)*Math.cos(theta); starPos[i*3+1] = r*Math.sin(phi)*Math.sin(theta); starPos[i*3+2] = r*Math.cos(phi)
      }
      const starGeo = new THREE.BufferGeometry()
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.5, sizeAttenuation: false, depthWrite: false, blending: THREE.AdditiveBlending })
      scene.add(new THREE.Points(starGeo, starMat))

      setLoaded(true)

      // ── Rotation targets ──────────────────────────────────────────────────
      const [FR, DE, ES] = COUNTRIES
      const rFR = -(FR.lon * Math.PI / 180)   // -0.0386
      const rDE = -(DE.lon * Math.PI / 180)   // -0.1824
      const rES = -(ES.lon * Math.PI / 180)   //  0.0655

      const zCam = (lat: number) => ({
        z: 1.45,
        y: 0.55 + Math.sin(lat * Math.PI / 180) * 0.30,
        lookY: Math.sin(lat * Math.PI / 180) * 0.38,
      })
      const idleCam = { z: 2.8, y: 0.6, lookY: 0.15 }

      // ── Render loop ───────────────────────────────────────────────────────
      const opacityProxy = { v: 1 }
      let progressP = 0, rafId = 0
      const render = () => {
        if (disposed) return
        // Gentle idle sway (fades out once scroll starts)
        const idleK = Math.max(0, 1 - progressP / 0.08)
        globeGroup.rotation.y = gp.y + Math.sin(performance.now() * 0.00025) * (3 * Math.PI / 180) * idleK
        globeGroup.rotation.x = gp.x
        atmoA.rotation.y = globeGroup.rotation.y; atmoA.rotation.x = gp.x
        atmoB.rotation.y = globeGroup.rotation.y; atmoB.rotation.x = gp.x
        renderer.render(scene, camera)
        rafId = requestAnimationFrame(render)
      }
      render()

      // ── Scroll timeline (paused — Lenis drives it) ────────────────────────
      const seq = gsap.timeline({ paused: true })

      // France — slingshot east then sweep west
      seq.to(gp,  { y: -(15 * Math.PI/180),    duration: 0.07, ease: "power3.in"   }, 0.05)
      seq.to(gp,  { y: rFR, x: 0.28,           duration: 0.15, ease: "power4.out"  }, 0.12)
      seq.to(cam, { ...zCam(FR.lat),            duration: 0.17, ease: "power2.out", onUpdate: applyCamera }, 0.12)

      // Germany — stay zoomed, rotate
      seq.to(gp,  { y: rDE, x: 0.22,           duration: 0.18, ease: "power4.inOut" }, 0.32)
      seq.to(cam, { ...zCam(DE.lat),            duration: 0.16, ease: "power2.inOut", onUpdate: applyCamera }, 0.34)

      // Spain — stay zoomed, rotate
      seq.to(gp,  { y: rES, x: 0.22,           duration: 0.18, ease: "power4.inOut" }, 0.60)
      seq.to(cam, { ...zCam(ES.lat),            duration: 0.16, ease: "power2.inOut", onUpdate: applyCamera }, 0.62)

      // Final dezoom
      seq.to(gp,  { y: -(10 * Math.PI/180), x: 0.38, duration: 0.12, ease: "power2.inOut" }, 0.87)
      seq.to(cam, { ...idleCam,                 duration: 0.13, ease: "power2.inOut", onUpdate: applyCamera }, 0.87)
      seq.to(opacityProxy, { v: 0,              duration: 0.06, ease: "power2.in",
        onUpdate: () => { section.style.opacity = String(opacityProxy.v) },
      }, 0.94)

      seq.duration(1)

      // ── Label + hint ──────────────────────────────────────────────────────
      let cur: Country | null = null
      const upd = (c: Country | null) => { if (c !== cur) { cur = c; setActive(c) } }

      let hintHidden = false
      const setHint = (hide: boolean) => {
        if (hide === hintHidden || !hint) return
        hintHidden = hide
        hint.style.opacity = hide ? "0" : "1"
        hint.style.transform = `translateX(-50%) translateY(${hide ? "12px" : "0"})`
      }

      const onProgress = (p: number) => {
        progressP = p; seq.progress(p); setHint(p > 0.05)
        if      (p > 0.12 && p < 0.33) upd(FR)
        else if (p > 0.35 && p < 0.61) upd(DE)
        else if (p > 0.63 && p < 0.88) upd(ES)
        else upd(null)
      }
      const computeP = (scroll: number) => Math.max(0, Math.min(1, (scroll - wrapper.offsetTop) / SCROLL_RANGE))

      // ── Lenis scroll driver ───────────────────────────────────────────────
      let lenisHandler: ((e: { scroll: number }) => void) | null = null
      let lenisTimer: ReturnType<typeof setTimeout> | null = null
      let fallbackFn: (() => void) | null = null
      let attempts = 0

      const attach = () => {
        if (disposed) return
        const lenis = (window as any).__lenis
        if (!lenis) {
          if (++attempts < 20) { lenisTimer = setTimeout(attach, 150) }
          else {
            fallbackFn = () => onProgress(computeP(window.scrollY))
            window.addEventListener("scroll", fallbackFn, { passive: true })
            fallbackFn()
          }
          return
        }
        lenisHandler = ({ scroll }: { scroll: number }) => onProgress(computeP(scroll))
        lenis.on("scroll", lenisHandler)
        onProgress(computeP(window.scrollY))
      }
      lenisTimer = setTimeout(attach, 100)

      const onResize = () => {
        const W = canvas.clientWidth || window.innerWidth, H = canvas.clientHeight || window.innerHeight
        renderer.setSize(W, H, false); camera.aspect = W/H; camera.updateProjectionMatrix()
      }
      window.addEventListener("resize", onResize)

      ;(canvas as any).__cleanup = () => {
        seq.kill(); markerAnims.forEach(t => t.kill()); cancelAnimationFrame(rafId)
        if (lenisTimer) clearTimeout(lenisTimer)
        const lenis = (window as any).__lenis
        if (lenis && lenisHandler) lenis.off("scroll", lenisHandler)
        if (fallbackFn) window.removeEventListener("scroll", fallbackFn)
        window.removeEventListener("resize", onResize)
        sphereGeo.dispose(); sphereMat.dispose()
        starGeo.dispose(); starMat.dispose()
        earthTex.dispose(); renderer.dispose()
      }
    })()

    return () => {
      disposed = true
      const fn = (canvasRef.current as any)?.__cleanup
      if (typeof fn === "function") fn()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="globe-hero-wrapper">
      <section ref={sectionRef} className="globe-hero-section" data-hero="dark">
        <canvas ref={canvasRef} className="globe-hero-canvas" />

        {active && (
          <div className="globe-hero-label" key={active.code}>
            <div className="globe-hero-label__market" style={{ color: active.color }}>{active.market}</div>
            <div className="globe-hero-label__name">{active.name}</div>
            <div className="globe-hero-label__tag">{active.tagline}</div>
          </div>
        )}

        <div ref={hintRef} className="globe-hero-hint" aria-hidden="true">
          <span>Scroll</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M4.5 1 V12 M1 8.5 L4.5 12 L8 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {!loaded && <div className="globe-hero-loader" aria-hidden="true"><span /></div>}
      </section>
    </div>
  )
}
