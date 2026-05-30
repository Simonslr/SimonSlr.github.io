"use client"

import { useEffect } from "react"

export default function ScrollAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let ctx: { revert: () => void } | undefined
    const localCleanups: Array<() => void> = []

    async function init() {
      const { gsap }          = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      const { CustomEase }    = await import("gsap/CustomEase")
      gsap.registerPlugin(ScrollTrigger, CustomEase)

      const EASE = {
        outEditorial: CustomEase.create("sa-editorial", "M0,0 C0.22,1 0.36,1 1,1"),
        outCine:      CustomEase.create("sa-cine",      "M0,0 C0.16,1 0.30,1 1,1"),
        inOutCine:    CustomEase.create("sa-inout",     "M0,0 C0.65,0 0.35,1 1,1"),
      }

      ctx = gsap.context(() => {

        if (!reduced) {
        // ── 1. Legacy .reveal-line ────────────────────────────────────────
        document.querySelectorAll("h1, h2").forEach((h) => {
          const lines = h.querySelectorAll<HTMLElement>(".reveal-line > span")
          if (!lines.length) return
          ScrollTrigger.create({
            trigger: h, start: "top 90%", once: true,
            onEnter: () => {
              gsap.fromTo(lines, { yPercent: 105 },
                { yPercent: 0, duration: 0.95, stagger: 0.10, ease: EASE.outEditorial })
            },
          })
        })

        // ── 2. data-reveal="fade" ─────────────────────────────────────────
        document.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
          ScrollTrigger.create({
            trigger: el, start: "top 90%", once: true,
            onEnter: () => {
              gsap.fromTo(el, { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.85, ease: EASE.outCine })
            },
          })
        })

        // ── 3. data-reveal="card" ─────────────────────────────────────────
        if (ScrollTrigger.batch) {
          ScrollTrigger.batch('[data-reveal="card"]', {
            start: "top 90%", once: true,
            onEnter: (els: Element[]) => {
              gsap.fromTo(els, { opacity: 0, y: 36 },
                { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: EASE.outEditorial })
            },
          })
        }

        // ── 4. data-stagger-grid ──────────────────────────────────────────
        document.querySelectorAll<HTMLElement>("[data-stagger-grid]").forEach((grid) => {
          const items = grid.children
          gsap.set(items, { y: 24, opacity: 0 })
          ScrollTrigger.create({
            trigger: grid, start: "top 80%", once: true,
            onEnter: () => {
              gsap.to(items, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: EASE.outEditorial })
            },
          })
        })
        } // end !reduced sections 1-4

        // ── 5. Count-up (data-count) ──────────────────────────────────────
        document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const to = parseFloat(el.dataset.count || "0")
          if (!isFinite(to)) return
          if (reduced) {
            el.textContent = el.dataset.fmt === "int"
              ? Math.round(to).toLocaleString("fr-FR")
              : to.toFixed(1).replace(".", ",")
            return
          }
          const proxy = { v: 0 }
          ScrollTrigger.create({
            trigger: el, start: "top 90%", once: true,
            onEnter: () => {
              gsap.to(proxy, {
                v: to, duration: 1.4, ease: EASE.outCine,
                onUpdate: () => {
                  el.textContent = el.dataset.fmt === "int"
                    ? Math.round(proxy.v).toLocaleString("fr-FR")
                    : proxy.v.toFixed(1).replace(".", ",")
                },
              })
            },
          })
        })

        // ── 6. Comparison bar + best-row pulse ────────────────────────────
        document.querySelectorAll<HTMLElement>("[data-cmp-bar]").forEach((bar) => {
          const target = parseFloat(bar.dataset.cmpBar || "0")
          if (reduced) { gsap.set(bar, { "--w": target + "%" } as gsap.TweenVars); return }
          gsap.set(bar, { "--w": "0%" } as gsap.TweenVars)
          ScrollTrigger.create({
            trigger: bar, start: "top 88%", once: true,
            onEnter: () => {
              gsap.to(bar, { duration: 0.8, ease: EASE.outCine, "--w": target + "%" } as gsap.TweenVars)
            },
          })
        })
        if (!reduced) document.querySelectorAll<HTMLElement>(".cmp__row.is-best").forEach((row) => {
          ScrollTrigger.create({
            trigger: row, start: "top 85%", once: true,
            onEnter: () => {
              gsap.fromTo(row,
                { boxShadow: "0 0 0 0 rgba(110,231,183,0.55)" },
                { boxShadow: "0 0 0 14px rgba(110,231,183,0)", duration: 1.1, ease: EASE.outCine })
            },
          })
        })

        // ── 7. Method section pin ─────────────────────────────────────────
        if (!reduced && window.innerWidth >= 900) {
          const sec = document.querySelector<HTMLElement>("[data-pin-section]")
          if (sec) {
            const head  = sec.querySelector<HTMLElement>(".method__head")
            const steps = sec.querySelectorAll<HTMLElement>(".step")
            const prog  = sec.querySelector<HTMLElement>("#method-progress")
            const tl = gsap.timeline({
              scrollTrigger: { trigger: sec, start: "top top", end: "+=600", pin: true, scrub: 1.4, anticipatePin: 1 },
            })
            if (head) tl.fromTo(head, { y: 0, opacity: 1 }, { y: -40, opacity: 0.92, ease: "none" }, 0)
            steps.forEach((s, i) => {
              tl.fromTo(s,
                { x: i === 0 ? -60 : i === 2 ? 60 : 0, y: 40, opacity: 0 },
                { x: 0, y: 0, opacity: 1, ease: "none" },
                0.15 + i * 0.25)
            })
            if (prog) tl.fromTo(prog, { "--p": "0%" } as gsap.TweenVars, { "--p": "100%", ease: "none" } as gsap.TweenVars, 0.15)
          }
        }

        // ── 8. Curtain reveals ────────────────────────────────────────────
        if (!reduced) {
        // data-curtain="rtl": right→left clip (Method demos)
        document.querySelectorAll<HTMLElement>('[data-curtain="rtl"]').forEach((el) => {
          gsap.set(el, { clipPath: "inset(0 0 0 100%)" })
          ScrollTrigger.create({
            trigger: el, start: "top 85%", once: true,
            onEnter: () => {
              gsap.to(el, { clipPath: "inset(0 0 0 0%)", duration: 1.0, ease: EASE.outEditorial })
            },
          })
        })
        // data-curtain-up: bottom→top clip (CTA title lines)
        document.querySelectorAll<HTMLElement>("[data-curtain-up]").forEach((el, i) => {
          gsap.set(el, { clipPath: "inset(100% 0 0 0)", yPercent: 25 })
          ScrollTrigger.create({
            trigger: el, start: "top 88%", once: true,
            onEnter: () => {
              gsap.to(el, {
                clipPath: "inset(0% 0 0 0)", yPercent: 0,
                duration: 0.9, delay: i * 0.09, ease: EASE.outEditorial,
              })
            },
          })
        })
        } // end !reduced section 8

        // ── 9. Lines that extend L→R on scrub ────────────────────────────
        if (!reduced) {
        document.querySelectorAll<HTMLElement>("[data-extend-x]").forEach((el) => {
          gsap.fromTo(el,
            { scaleX: 0, transformOrigin: "0% 50%" },
            {
              scaleX: 1, ease: "none",
              scrollTrigger: { trigger: el, start: "top 92%", end: "top 30%", scrub: 1 },
            })
        })
        document.querySelectorAll<HTMLElement>("[data-trust-line]").forEach((el) => {
          gsap.fromTo(el,
            { scaleX: 0, transformOrigin: "0% 50%" },
            {
              scaleX: 1, ease: "none",
              scrollTrigger: { trigger: el, start: "top 90%", end: "top 50%", scrub: 1 },
            })
        })
        } // end !reduced section 9

        // ── 10. Featured: 3D parallax + cascade reveal ────────────────────
        if (!reduced) {
        const featured = document.querySelector<HTMLElement>("[data-featured-section]")
        if (featured) {
          const media   = featured.querySelector<HTMLElement>("[data-featured-media]")
          const cascade = featured.querySelectorAll<HTMLElement>(
            ".eyebrow, h2, .sub, .featured__price, .featured__compare, .featured__cta-row, .featured__updated"
          )
          if (media) {
            gsap.set(media, { transformStyle: "preserve-3d", transformPerspective: 800 })
            gsap.fromTo(media,
              { yPercent: 8, rotationY: -10 },
              {
                yPercent: -8, rotationY: 10, ease: "none",
                scrollTrigger: { trigger: featured, start: "top bottom", end: "bottom top", scrub: 1.3 },
              })
          }
          if (cascade.length) {
            ScrollTrigger.create({
              trigger: featured, start: "top 75%", once: true,
              onEnter: () => {
                gsap.fromTo(cascade,
                  { opacity: 0, x: 40 },
                  { opacity: 1, x: 0, duration: 0.9, stagger: 0.08, ease: EASE.outCine })
              },
            })
          }
        }
        } // end !reduced section 10

        // ── 11. Price ticker (digit scramble) ─────────────────────────────
        document.querySelectorAll<HTMLElement>("[data-price-ticker]").forEach((el) => {
          const target    = parseFloat(el.dataset.priceTarget || "0")
          const fmt       = el.dataset.priceFormat || "eur"
          if (!isFinite(target)) return
          const finalText = el.textContent ?? ""
          if (reduced) { el.textContent = finalText; return }
          ScrollTrigger.create({
            trigger: el, start: "top 88%", once: true,
            onEnter: () => {
              const proxy = { v: 0 }
              gsap.to(proxy, {
                v: target, duration: 1.25, ease: EASE.outEditorial,
                onUpdate: () => {
                  if (fmt === "pct") {
                    el.textContent = `−${Math.round(proxy.v)} %`
                  } else {
                    el.textContent = new Intl.NumberFormat("fr-FR", {
                      style: "currency", currency: "EUR",
                      minimumFractionDigits: 2, maximumFractionDigits: 2,
                    }).format(proxy.v).replace(/ /g, " ")
                  }
                },
                onComplete: () => { el.textContent = finalText },
              })
            },
          })
        })

        // ── 11b. Per-character split reveal (data-split-chars) ───────────
        if (!reduced) document.querySelectorAll<HTMLElement>("[data-split-chars]").forEach((line, idx) => {
          const target = line.querySelector<HTMLElement>("span") ?? line
          if (target.dataset['split'] === "1") return
          const wrap = (el: Element) => {
            Array.from(el.childNodes).forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment()
                Array.from(node.textContent ?? "").forEach((ch) => {
                  if (ch === " ") { frag.appendChild(document.createTextNode(" ")); return }
                  const s = document.createElement("span"); s.className = "sc__c"; s.textContent = ch
                  frag.appendChild(s)
                })
                el.replaceChild(frag, node)
              } else if (node.nodeType === Node.ELEMENT_NODE) { wrap(node as Element) }
            })
          }
          wrap(target);
          target.dataset['split'] = "1"
          const chars = target.querySelectorAll<HTMLElement>(".sc__c")
          gsap.set(chars, { yPercent: 110 })
          ScrollTrigger.create({
            trigger: line, start: "top 88%", once: true,
            onEnter: () => {
              gsap.to(chars, { yPercent: 0, duration: 0.95, ease: EASE.outEditorial,
                stagger: { each: 0.015, from: "start" as const }, delay: idx * 0.05 })
            },
          })
        })

        // ── 12. Peel transition ───────────────────────────────────────────
        if (!reduced) {
          const peel = document.querySelector<HTMLElement>(".peel-target")
          if (peel) {
            gsap.set(peel, { clipPath: "inset(100% 0 0 0)" })
            gsap.to(peel, {
              clipPath: "inset(0% 0 0 0)", ease: EASE.inOutCine,
              scrollTrigger: { trigger: peel, start: "top bottom", end: "top top+=10%", scrub: 1.2 },
            })
          }
        }

      }) // end gsap.context

      // ── Outside context: live listeners ──────────────────────────────────
      const finePointer = window.matchMedia("(pointer: fine)").matches

      // 3D card tilt — applied on .card__inner for shadow decoupling
      if (!reduced && finePointer) {
        document.querySelectorAll<HTMLElement>(".card").forEach((card) => {
          const inner = card.querySelector<HTMLElement>(".card__inner") ?? card
          const onMove = (e: MouseEvent) => {
            const r  = card.getBoundingClientRect()
            const cx = r.left + r.width  / 2
            const cy = r.top  + r.height / 2
            const rx = ((e.clientY - cy) / (r.height / 2)) * -6
            const ry = ((e.clientX - cx) / (r.width  / 2)) *  6
            inner.style.transform  = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`
            inner.style.transition = "transform 80ms ease-out"
          }
          const onLeave = () => {
            inner.style.transform  = ""
            inner.style.transition = "transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)"
          }
          card.addEventListener("mousemove", onMove)
          card.addEventListener("mouseleave", onLeave)
          localCleanups.push(() => {
            card.removeEventListener("mousemove", onMove)
            card.removeEventListener("mouseleave", onLeave)
          })
        })
      }

      // Magnetic buttons — translate up to 12px toward cursor
      if (!reduced && finePointer) {
        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
          const STRENGTH = 0.32, MAX = 12
          const onMove = (e: MouseEvent) => {
            const r  = btn.getBoundingClientRect()
            const dx = Math.max(-MAX, Math.min(MAX, (e.clientX - (r.left + r.width  / 2)) * STRENGTH))
            const dy = Math.max(-MAX, Math.min(MAX, (e.clientY - (r.top  + r.height / 2)) * STRENGTH))
            btn.style.transform  = `translate(${dx}px, ${dy}px)`
            btn.style.transition = "transform 120ms ease-out"
          }
          const onLeave = () => {
            btn.style.transform  = ""
            btn.style.transition = "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)"
          }
          btn.addEventListener("mousemove", onMove)
          btn.addEventListener("mouseleave", onLeave)
          localCleanups.push(() => {
            btn.removeEventListener("mousemove", onMove)
            btn.removeEventListener("mouseleave", onLeave)
          })
        })
      }

      // Marquee hover pause
      document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((mq) => {
        const track = mq.querySelector<HTMLElement>(".mq2__track, .mq__track")
        if (!track) return
        const onEnter = () => { track.style.animationPlayState = "paused" }
        const onLeave = () => { track.style.animationPlayState = "running" }
        mq.addEventListener("mouseenter", onEnter)
        mq.addEventListener("mouseleave", onLeave)
        localCleanups.push(() => {
          mq.removeEventListener("mouseenter", onEnter)
          mq.removeEventListener("mouseleave", onLeave)
        })
      })

      if ("fonts" in document) {
        (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready
          .then(() => ScrollTrigger.refresh())
      }
    }

    const t = setTimeout(init, 80)
    return () => {
      clearTimeout(t)
      ctx?.revert()
      localCleanups.forEach(fn => fn())
    }
  }, [])

  return null
}
