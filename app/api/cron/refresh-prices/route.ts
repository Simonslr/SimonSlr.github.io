import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import products from "@/data/products.json"
import type { Product } from "@/lib/types"
import { getRecommendation } from "@/lib/scoring"
import { timingSafeCompare } from "@/lib/security"

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret") ?? ""
  if (!timingSafeCompare(secret, process.env.CRON_SECRET ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const allProducts = products as Product[]

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
      console.error("[cron] price_history insert failed:", error.code)
    }
  }

  return NextResponse.json({
    ok:       !insertFailed,
    recorded: historyRows.length,
  })
}
