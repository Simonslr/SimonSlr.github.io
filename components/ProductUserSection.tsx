"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/browser"
import ShareButton from "@/components/ShareButton"
import PriceChart from "@/components/PriceChart"

interface PriceRecord { recorded_at: string; price: number; country: string }

interface Props {
  slug:        string
  name:        string
  bestPrice:   number
  bestCountry: string
  pageUrl:     string
}

export default function ProductUserSection({ slug, name, pageUrl }: Props) {
  const [priceHistory, setPriceHistory] = useState<PriceRecord[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("price_history")
      .select("recorded_at, price, country")
      .eq("product_slug", slug)
      .order("recorded_at", { ascending: true })
      .limit(90)
      .then(({ data }) => {
        if (data && data.length >= 2) setPriceHistory(data)
      })
  }, [slug])

  return (
    <>
      <div className="pdp-cta-row" style={{ marginTop: 24 }}>
        <ShareButton title={`${name} — EuroCompare`} url={pageUrl} />
      </div>

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
