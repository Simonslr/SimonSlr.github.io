export default function ProductLoading() {
  return (
    <div style={{ paddingTop: 64, background: "var(--bg)", minHeight: "100vh" }}>
      <div className="wrap">
        <div className="crumbs" style={{ opacity: 0.3 }}>
          <span style={{ width: 120, height: 14, background: "var(--border)", borderRadius: 4, display: "inline-block" }} />
        </div>
      </div>

      <section className="pdp-hero">
        <div className="wrap">
          <div className="pdp-hero__grid">
            {/* Image skeleton */}
            <figure className="pdp-hero__media pdp-skeleton" />

            {/* Info skeleton */}
            <div className="pdp-hero__info" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="pdp-skeleton" style={{ width: 120, height: 14, borderRadius: 4 }} />
              <div className="pdp-skeleton" style={{ width: "80%", height: 32, borderRadius: 6 }} />
              <div className="pdp-skeleton" style={{ width: "60%", height: 32, borderRadius: 6 }} />
              <div className="pdp-skeleton" style={{ width: "100%", height: 56, borderRadius: 6 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                <div className="pdp-skeleton" style={{ width: 100, height: 36, borderRadius: 6 }} />
                <div className="pdp-skeleton" style={{ width: 160, height: 22, borderRadius: 4 }} />
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <div className="pdp-skeleton" style={{ width: 200, height: 48, borderRadius: 10 }} />
                  <div className="pdp-skeleton" style={{ width: 48,  height: 48, borderRadius: 10 }} />
                  <div className="pdp-skeleton" style={{ width: 48,  height: 48, borderRadius: 10 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cmp">
        <div className="wrap">
          <div className="cmp__head">
            <div className="pdp-skeleton" style={{ width: 220, height: 24, borderRadius: 6 }} />
          </div>
          <div className="cmp__rows" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
            {[0, 1, 2].map(i => (
              <div key={i} className="pdp-skeleton" style={{ height: 68, borderRadius: 10 }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
