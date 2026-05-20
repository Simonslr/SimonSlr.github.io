import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import DesignNavbar from "@/components/DesignNavbar"
import { createClient } from "@/lib/supabase/server"
import { getFavorites } from "@/app/actions/favorites"
import { getAlerts } from "@/app/actions/alerts"
import { signOut } from "@/app/actions/auth"
import DeleteAlertButton from "@/components/DeleteAlertButton"
import products from "@/data/products.json"
import type { Product } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"

export const metadata: Metadata = {
  title: "Mon compte | EuroCompare",
}

function fmt(n: number) {
  return n % 1 === 0
    ? `${n.toFixed(0)} €`
    : n.toFixed(2).replace(".", ",") + " €"
}

function fmtDate(iso?: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

const COUNTRY_AMZ: Record<string, string> = {
  FR: "Amazon.fr",
  DE: "Amazon.de",
  ES: "Amazon.es",
}

const PAGE_CSS = `
  .compte-accent-band {
    height: 2px;
    background: linear-gradient(90deg, var(--blue) 0%, rgba(37,99,235,0.5) 14%, rgba(37,99,235,0) 38%);
  }
  .compte-signout {
    position: relative;
    display: inline-block;
    padding-bottom: 2px;
    font-size: 13px;
    color: var(--text-mute);
    background: none;
    border: 0;
    cursor: pointer;
    font-family: inherit;
    transition: color 200ms;
  }
  .compte-signout::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 1px;
    background: rgba(15,23,42,0.35);
    transform: scaleX(1);
    transform-origin: right center;
    transition: transform 320ms cubic-bezier(.16,1,.3,1), background 200ms;
  }
  .compte-signout:hover { color: var(--text); }
  .compte-signout:hover::after { background: var(--text); transform-origin: left center; }

  .compte-empty {
    position: relative;
    padding: 32px 0 56px;
    min-height: 220px;
    overflow: hidden;
  }
  .compte-empty__ghost {
    position: absolute;
    left: -0.04em; top: -0.18em;
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(96px, 14vw, 200px);
    line-height: 1;
    letter-spacing: -0.025em;
    color: rgba(15,23,42,0.04);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }
  .compte-empty__body {
    position: relative;
    z-index: 2;
    padding-top: 110px;
    max-width: 46ch;
  }
  .compte-empty__line {
    font-size: 17px;
    line-height: 1.55;
    color: var(--text);
    letter-spacing: -0.005em;
  }
  .compte-empty__cta {
    margin-top: 22px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text);
    position: relative;
    padding-bottom: 4px;
    text-decoration: none;
  }
  .compte-empty__cta::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 1px;
    background: var(--text);
    transform: scaleX(1);
    transform-origin: right center;
    transition: transform 360ms cubic-bezier(.16,1,.3,1);
  }
  .compte-empty__cta:hover::after { transform-origin: left center; }
  .compte-empty__cta .arrow { display: inline-block; transition: transform 260ms cubic-bezier(.16,1,.3,1); }
  .compte-empty__cta:hover .arrow { transform: translateX(4px); }

  .compte-fav-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    text-decoration: none;
    color: inherit;
    border-radius: 16px;
    transition: transform 320ms cubic-bezier(.16,1,.3,1), box-shadow 320ms;
  }
  .compte-fav-card:hover { transform: translateY(-4px); }
  .compte-fav-card[data-best="FR"]:hover { box-shadow: 0 22px 44px -22px rgba(37,99,235,0.35); }
  .compte-fav-card[data-best="DE"]:hover { box-shadow: 0 22px 44px -22px rgba(180,83,9,0.35); }
  .compte-fav-card[data-best="ES"]:hover { box-shadow: 0 22px 44px -22px rgba(220,38,38,0.32); }

  .compte-title {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(64px, 7vw, 112px);
    line-height: 0.96;
    letter-spacing: -0.02em;
    color: var(--text);
    text-shadow: 0 0 40px rgba(37,99,235,0.08);
    margin: 16px 0 0;
  }
  .compte-title .dot { color: var(--blue); }

  .compte-alert-bar {
    grid-column: 1 / -1;
    margin-top: 6px;
    height: 2px;
    background: var(--bg-soft);
    border-radius: 999px;
    overflow: hidden;
    position: relative;
  }
  .compte-alert-bar > span {
    display: block;
    height: 100%;
    width: var(--p, 0%);
    border-radius: inherit;
    transform: scaleX(0);
    transform-origin: left center;
    animation: compte-bar-in 800ms cubic-bezier(.16,1,.3,1) forwards;
  }
  .compte-alert-bar.close > span,
  .compte-alert-bar.fired > span { background: #059669; }
  .compte-alert-bar.far > span   { background: rgba(15,23,42,0.35); }
  @keyframes compte-bar-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  .compte-status-dot {
    width: 8px; height: 8px; border-radius: 999px;
    background: rgba(15,23,42,0.35);
    flex-shrink: 0;
    position: relative;
  }
  .compte-status-active .compte-status-dot { background: #059669; }
  .compte-status-active .compte-status-dot::after {
    content: "";
    position: absolute; inset: -4px;
    border-radius: 999px;
    background: #059669;
    opacity: 0.25;
    animation: compte-pulse 2s ease-in-out infinite;
  }
  @keyframes compte-pulse {
    0%, 100% { transform: scale(0.6); opacity: 0.35; }
    50%      { transform: scale(1.2); opacity: 0; }
  }

  .compte-bottom a { transition: color 150ms; }
  .compte-bottom a:hover { color: var(--blue); }

  @media (max-width: 720px) {
    .compte-alert-row {
      grid-template-columns: 1fr auto 28px !important;
      grid-template-areas:
        "name name del"
        "thr  status status"
        "bar  bar  bar" !important;
    }
    .compte-alert-row .ar-name   { grid-area: name; }
    .compte-alert-row .ar-thr    { grid-area: thr; }
    .compte-alert-row .ar-status { grid-area: status; justify-self: end; }
    .compte-alert-row .ar-del    { grid-area: del; }
    .compte-alert-row .compte-alert-bar { grid-area: bar; }
  }
`

const LBL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "rgba(15,23,42,0.5)",
  display: "inline-flex",
  alignItems: "baseline",
  gap: 6,
}

const META: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "rgba(15,23,42,0.35)",
}

const SECTION_HEAD: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 24,
  marginBottom: 36,
}

export default async function ComptePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/connexion")

  const [favorites, alerts] = await Promise.all([getFavorites(), getAlerts()])
  const allProducts = products as Product[]

  const activeAlerts    = alerts.filter((a) => !a.triggered).length
  const triggeredAlerts = alerts.filter((a) =>  a.triggered).length

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <DesignNavbar />

      <div className="compte-accent-band" aria-hidden="true" />

      <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <div className="wrap">

          {/* HEADER */}
          <header style={{ padding: "56px 0 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.02em", color: "var(--text-mute)" }}>
                  {user.email}
                </div>
                <h1 className="compte-title">
                  Mon compte<span className="dot">.</span>
                </h1>
              </div>
              <form action={signOut} style={{ marginTop: 6 }}>
                <button type="submit" className="compte-signout">
                  Se déconnecter
                </button>
              </form>
            </div>
            <hr style={{ marginTop: 56, height: 1, background: "var(--border)", border: 0 }} />
          </header>

          {/* FAVORIS */}
          <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
            {favorites.length === 0 ? (
              <div className="compte-empty">
                <div className="compte-empty__ghost">Favoris</div>
                <div className="compte-empty__body">
                  <p className="compte-empty__line">
                    Sauvegardez les produits qui vous intéressent depuis chaque fiche produit.
                  </p>
                  <Link href="/#catalogue" className="compte-empty__cta">
                    Explorer le catalogue <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={SECTION_HEAD}>
                  <div style={LBL}>
                    Favoris{" "}
                    <span style={{ opacity: 0.8, fontVariantNumeric: "tabular-nums" }}>
                      ({favorites.length})
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 28 }}>
                  {favorites.map((fav) => {
                    const product = allProducts.find((p) => p.slug === fav.product_slug)
                    const reco    = product ? getRecommendation(product) : null
                    const best    = reco?.best?.country ?? "FR"

                    return (
                      <Link
                        key={fav.id}
                        href={`/produit/${fav.product_slug}`}
                        className="compte-fav-card"
                        data-best={best}
                      >
                        <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#f6f5f1", borderRadius: 16, overflow: "hidden" }}>
                          {product?.image && (
                            <Image
                              src={product.image}
                              alt={fav.product_name}
                              fill
                              sizes="(max-width: 720px) 50vw, 220px"
                              style={{ objectFit: "contain", padding: 20 }}
                            />
                          )}
                        </div>
                        <div style={{ padding: "0 4px", display: "flex", flexDirection: "column", gap: 6 }}>
                          {product?.name && (
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(15,23,42,0.55)" }}>
                              {product.name.split(" ")[0]}
                            </div>
                          )}
                          <div style={{
                            fontSize: 15, fontWeight: 500, lineHeight: 1.35, letterSpacing: "-0.01em", color: "var(--text)",
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                          }}>
                            {fav.product_name}
                          </div>
                          {reco && reco.savings > 0 && (
                            <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: 14, fontWeight: 600, color: "#059669", letterSpacing: "-0.01em" }}>
                              −{fmt(reco.savings)}
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </section>

          {/* ALERTES PRIX */}
          <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
            {alerts.length === 0 ? (
              <div className="compte-empty">
                <div className="compte-empty__ghost">Alertes prix</div>
                <div className="compte-empty__body">
                  <p className="compte-empty__line">
                    Vous recevrez un email dès qu&apos;un produit passe sous votre seuil.
                  </p>
                  <Link href="/#catalogue" className="compte-empty__cta">
                    Créer une alerte depuis un produit <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={SECTION_HEAD}>
                  <div style={LBL}>
                    Alertes prix{" "}
                    <span style={{ opacity: 0.8, fontVariantNumeric: "tabular-nums" }}>
                      ({alerts.length})
                    </span>
                  </div>
                  <div style={META}>
                    {activeAlerts} active{activeAlerts > 1 ? "s" : ""}
                    {triggeredAlerts > 0 && ` · ${triggeredAlerts} déclenchée${triggeredAlerts > 1 ? "s" : ""}`}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border)" }}>
                  {alerts.map((alert) => {
                    const isFired  = !!alert.triggered
                    const ratio    = alert.current_best_price > 0
                      ? Math.min(1, alert.target_price / alert.current_best_price)
                      : 0
                    const percent  = Math.round(ratio * 100)
                    const barClass = isFired ? "fired" : percent >= 80 ? "close" : "far"
                    const barCaption = isFired
                      ? `Seuil atteint — ${fmt(alert.current_best_price)}`
                      : `${fmt(alert.current_best_price)} actuel — seuil ${fmt(alert.target_price)}`

                    return (
                      <div
                        key={alert.id}
                        className="compte-alert-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.6fr 0.9fr 1fr 28px",
                          alignItems: "center",
                          columnGap: 24,
                          rowGap: 10,
                          padding: "22px 4px",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <Link
                          href={`/produit/${alert.product_slug}`}
                          className="ar-name"
                          style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.005em", color: "var(--text)", textDecoration: "none", lineHeight: 1.35, minWidth: 0, overflow: "hidden" }}
                        >
                          <small style={{ display: "block", fontFamily: "var(--font-mono)", fontWeight: 400, fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 4 }}>
                            {COUNTRY_AMZ[alert.best_country] ?? alert.best_country}
                          </small>
                          {alert.product_name}
                        </Link>

                        <div className="ar-thr" style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: 14, color: "var(--text)", letterSpacing: "-0.01em" }}>
                          <span style={{ color: "var(--text-mute)", marginRight: 4 }}>Seuil &lt;</span>
                          {fmt(alert.target_price)}
                        </div>

                        <div
                          className={`ar-status${isFired ? "" : " compte-status-active"}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13, color: isFired ? "var(--text-mute)" : "#059669", fontWeight: isFired ? 400 : 500 }}
                        >
                          <span className="compte-status-dot" aria-hidden="true" />
                          {isFired ? (
                            <>
                              Déclenché{" "}
                              {alert.triggered_at && (
                                <time style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.02em" }}>
                                  le {fmtDate(alert.triggered_at)}
                                </time>
                              )}
                            </>
                          ) : "Actif"}
                        </div>

                        <div className="ar-del" style={{ justifySelf: "end" }}>
                          <DeleteAlertButton alertId={alert.id} />
                        </div>

                        <div
                          className={`compte-alert-bar ${barClass}`}
                          aria-hidden="true"
                          title={barCaption}
                        >
                          <span style={{ ["--p" as string]: `${percent}%` } as React.CSSProperties} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </section>

          {/* RETOUR */}
          <div className="compte-bottom" style={{ padding: "56px 0 96px" }}>
            <Link
              href="/#catalogue"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text)", textDecoration: "none", borderBottom: "1px solid rgba(15,23,42,0.18)", paddingBottom: 4 }}
            >
              ← Voir tous les produits
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
