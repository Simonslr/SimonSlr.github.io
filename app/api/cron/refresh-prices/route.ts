import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import products from "@/data/products.json"
import type { Product } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"
import { sendAlertEmail } from "@/lib/emails"
import { timingSafeCompare } from "@/lib/security"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  // ── Auth: timing-safe comparison prevents secret enumeration ──────────────
  const secret = request.headers.get("x-cron-secret") ?? ""
  if (!timingSafeCompare(secret, process.env.CRON_SECRET ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const allProducts = products as Product[]

  // 1. Record current prices into price_history
  const historyRows = allProducts.flatMap((product) => {
    const reco = getRecommendation(product)
    if (!reco) return []
    return reco.ranked.map((r) => ({
      product_slug: product.slug,
      country:      r.country,
      price:        r.total,
    }))
  })

  let insertFailed = false
  if (historyRows.length > 0) {
    const { error } = await supabase.from("price_history").insert(historyRows)
    if (error) {
      insertFailed = true
      // Log server-side only — do NOT expose error.message in the response
      console.error("[cron] price_history insert failed:", error.code)
    }
  }

  // 2. Check active alerts
  const { data: activeAlerts } = await supabase
    .from("alerts")
    .select("*, profiles(email)")
    .eq("triggered", false)

  if (!activeAlerts || activeAlerts.length === 0) {
    return NextResponse.json({
      ok:       !insertFailed,
      recorded: historyRows.length,
      checked:  0,
    })
  }

  let fired = 0

  for (const alert of activeAlerts) {
    const product = allProducts.find((p) => p.slug === alert.product_slug)
    if (!product) continue

    const reco = getRecommendation(product)
    if (!reco) continue

    if (reco.best.total <= alert.target_price) {
      await supabase
        .from("alerts")
        .update({
          triggered:          true,
          triggered_at:       new Date().toISOString(),
          current_best_price: reco.best.total,
        })
        .eq("id", alert.id)

      const email = alert.profiles?.email
      if (email) {
        await sendAlertEmail({
          email,
          productName:  alert.product_name,
          productSlug:  alert.product_slug,
          currentPrice: reco.best.total,
          targetPrice:  alert.target_price,
          country:      reco.best.country,
          affiliateUrl: reco.best.offer.affiliate_url,
        })
        fired++
      }
    }
  }

  return NextResponse.json({
    ok:       !insertFailed,
    recorded: historyRows.length,
    checked:  activeAlerts.length,
    fired,
  })
}
