// EuroPrix — scroll storytelling: Lenis + GSAP + ScrollTrigger
// Plain JS file (loaded after GSAP/ScrollTrigger/Lenis CDNs).
// Exposes window.EuroPrixScroll = { init, refresh, kill }

(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis = null;
  let triggers = [];
  let tickerFn = null;

  function initLenis() {
    if (prefersReduced) return;
    if (!window.Lenis) return;
    lenis = new window.Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      lerp: 0.08,
    });
    lenis.on("scroll", () => window.ScrollTrigger && window.ScrollTrigger.update());
    tickerFn = (time) => { if (lenis) lenis.raf(time * 1000); };
    window.gsap.ticker.add(tickerFn);
    window.gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  function setInitialStates() {
    const gsap = window.gsap;
    // No-op: hidden initial states are set inline by fromTo tweens with immediateRender.
    // Keeping content visible by default means any failure mode (no JS, GSAP delay)
    // degrades gracefully to "no entrance animation" instead of "blank page".
  }

  function revealOnce() {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;

    // mask reveal — line by line. FROM state is set inside onEnter, so any element
    // we miss (or that's already above the fold when ScrollTrigger initializes)
    // stays visible by default.
    document.querySelectorAll("h1, h2").forEach((h) => {
      const lines = h.querySelectorAll(".reveal-line > span");
      if (!lines.length) return;
      const t = ST.create({
        trigger: h,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.fromTo(lines,
            { yPercent: 105 },
            { yPercent: 0, duration: 0.95, ease: "expo.out", stagger: 0.12, overwrite: "auto" });
        },
      });
      triggers.push(t);
    });

    // fade reveals
    document.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
      const t = ST.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.fromTo(el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.88, ease: "expo.out", overwrite: "auto" });
        },
      });
      triggers.push(t);
    });

    // card reveals — batched in groups of ~4
    if (ST.batch) {
      const b = ST.batch('[data-reveal="card"]', {
        start: "top 90%",
        once: true,
        onEnter: (els) => {
          gsap.fromTo(els,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.88, ease: "expo.out", stagger: 0.07, overwrite: "auto" });
        },
      });
      triggers = triggers.concat(b);
    }
  }

  function heroParallax() {
    const gsap = window.gsap;
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const inner = hero.querySelector(".hero__inner");
    const stats = hero.querySelector(".hero__stats");
    const bg = hero.querySelector(".hero__bg");

    // content rises out as user scrolls past hero
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });
    tl.to([inner, stats], { yPercent: -20, ease: "none" }, 0);
    if (bg) tl.to(bg, { yPercent: 20, opacity: 0.6, ease: "none" }, 0);
    triggers.push(tl.scrollTrigger);
  }

  function methodPinned() {
    const gsap = window.gsap;
    const sec = document.querySelector("[data-pin-section]");
    if (!sec) return;
    if (window.innerWidth < 900) return; // mobile: no pin

    const head = sec.querySelector(".method__head");
    const steps = sec.querySelectorAll(".step");
    const progress = sec.querySelector("#method-progress");

    // pin the whole section while we play a scrubbed timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: "+=900",
        pin: true,
        scrub: 1.4,
        anticipatePin: 1,
      },
    });

    tl.fromTo(head, { y: 0, opacity: 1 }, { y: -40, opacity: 0.92, ease: "none" }, 0);
    steps.forEach((step, i) => {
      tl.fromTo(step,
        { x: i === 0 ? -60 : i === 2 ? 60 : 0, y: 40, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: "none" },
        0.15 + i * 0.25
      );
    });
    if (progress) {
      tl.fromTo(progress, { "--p": "0%" }, { "--p": "100%", ease: "none" }, 0.15);
    }
    triggers.push(tl.scrollTrigger);
  }

  function featuredScrub() {
    const gsap = window.gsap;
    const sec = document.querySelector("[data-featured-section]");
    if (!sec) return;
    const media = sec.querySelector("[data-featured-media]");
    const copy = sec.querySelector(".featured__copy");

    if (media) {
      const t1 = gsap.fromTo(media,
        { x: -70, y: 30 },
        {
          x: 0, y: -30, ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.3 },
        });
      triggers.push(t1.scrollTrigger);
    }
    if (copy) {
      // gentle cascade from the right on entry — FROM state set on enter only.
      const cascade = copy.querySelectorAll(".eyebrow, h2, .sub, .featured__price, .featured__compare, .featured__cta-row, .featured__updated");
      const t2 = window.ScrollTrigger.create({
        trigger: sec, start: "top 75%", once: true,
        onEnter: () => {
          gsap.fromTo(cascade,
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, ease: "expo.out", duration: 0.9, stagger: 0.08, overwrite: "auto" });
        },
      });
      triggers.push(t2);
    }
  }

  function navWatcher() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const darkSections = Array.from(document.querySelectorAll(".hero[data-hero='dark'], .method, .featured, .trust, .foot, .cta-fin"));

    const update = () => {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 8);

      const navMid = 32;
      const hit = darkSections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= navMid && r.bottom > navMid;
      });
      nav.classList.toggle("is-dark", !!hit);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function init() {
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("[EuroPrix] GSAP not loaded");
      return;
    }
    if (window.__eurocompInitDone) return; // idempotent — explicit kill required to re-init
    window.gsap.registerPlugin(window.ScrollTrigger);

    initLenis();

    if (prefersReduced) {
      navWatcher();
      window.__eurocompInitDone = true;
      return;
    }

    setInitialStates();
    revealOnce();
    heroParallax();
    methodPinned();
    featuredScrub();
    navWatcher();

    // ensure ScrollTrigger picks up final layout once fonts/images settle
    window.addEventListener("load", () => window.ScrollTrigger.refresh());
    setTimeout(() => window.ScrollTrigger.refresh(), 600);
    window.__eurocompInitDone = true;
  }

  function refresh() {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function kill() {
    triggers.forEach((t) => t && t.kill && t.kill());
    triggers = [];
    if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill());
    if (tickerFn && window.gsap) {
      window.gsap.ticker.remove(tickerFn);
      tickerFn = null;
    }
    if (lenis) { lenis.destroy(); lenis = null; }
    window.__eurocompInitDone = false;
  }

  window.EuroPrixScroll = { init, refresh, kill };
})();
