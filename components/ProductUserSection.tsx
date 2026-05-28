"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/browser"
import FavoriteButton from "@/components/FavoriteButton"
import AlertSection from "@/components/AlertSection"
import PriceChart from "@/components/PriceChart"
import ShareButton from "@/components/ShareButton"
import { getFavorites } from "@/app/actions/favorites"
import { getAlerts } from "@/app/actions/alerts"

interface ExistingAlert { id: string; product_slug: string; target_price: number; triggered: boolean }
interface PriceRecord   { recorded_at: string; price: number; country: string }

interface Props {
  slug:        string
  name:        string
  bestPrice:   number
  bestCountry: string
  pageUrl:     string
}

export default function ProductUserSection({ slug, name, bestPrice, bestCountry, pageUrl }: Props) {
  const [isLoggedIn,     setIsLoggedIn]     = useState(false)
  const [isFavorited,    setIsFavorited]    = useState(false)
  const [existingAlert,  setExistingAlert]  = useState<ExistingAlert | null>(null)
  const [priceHistory,   setPriceHistory]   = useState<PriceRecord[]>([])
  const [authLoaded,     setAuthLoaded]     = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      // Run auth check and price history in parallel
      const [{ data: { user } }, histResult] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from("price_history")
          .select("recorded_at, price, country")
          .eq("product_slug", slug)
          .order("recorded_at", { ascending: true })
          .limit(90),
      ])

      if (histResult.data && histResult.data.length >= 2) {
        setPriceHistory(histResult.data)
      }

      const loggedIn = !!user
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const [favorites, alerts] = await Promise.all([getFavorites(), getAlerts()])
        setIsFavorited(favorites.some((f: { product_slug: string }) => f.product_slug === slug))
        setExistingAlert(alerts.find((a: ExistingAlert) => a.product_slug === slug) ?? null)
      }

      setAuthLoaded(true)
    }

    init()
  }, [slug])

  return (
    <>
      {/* CTA buttons row — shown immediately with default state */}
      <div className="pdp-cta-row" style={{ marginTop: 24 }}>
        <FavoriteButton
          slug={slug}
          name={name}
          initialSaved={isFavorited}
          isLoggedIn={isLoggedIn}
        />
        <ShareButton title={`${name} — EuroCompare`} url={pageUrl} />
      </div>

      {/* Alert section — shown once auth is resolved */}
      {authLoaded && (
        <AlertSection
          slug={slug}
          name={name}
          bestPrice={bestPrice}
          bestCountry={bestCountry}
          isLoggedIn={isLoggedIn}
          existingAlert={existingAlert}
        />
      )}

      {/* Price history chart */}
      {priceHistory.length >= 2 && (
        <div style={{ marginTop: 36, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 16 }}>
            Historique des prix
          </p>
          <PriceChart data={priceHistory} slug={slug} />
        </div>
      )}
    </>
  )
}
