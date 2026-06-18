"use client"

export default function ScrollToCatalogueButton() {
  const handleScrollToCatalogue = () => {
    const el = document.getElementById("catalogue")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <button className="btn btn--primary btn--xl" onClick={handleScrollToCatalogue} type="button" data-magnetic>
      Voir les économies du jour
      <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 200ms cubic-bezier(0.32,0.72,0,1)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </button>
  )
}
