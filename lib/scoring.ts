import type { Product, Recommendation, RankedOffer, CountryCode } from "./types"

export function getRecommendation(product: Product): Recommendation | null {
  const ranked: RankedOffer[] = Object.entries(product.prices)
    .filter(([_, offer]) => offer != null && offer.in_stock && offer.price > 0)
    .map(([country, offer]) => ({
      country: country as CountryCode,
      total: offer.price + offer.shipping,
      offer,
    }))
    .sort((a, b) => a.total - b.total)

  if (ranked.length < 2) return null

  const best = ranked[0]
  const worst = ranked[ranked.length - 1]
  const savings = worst.total - best.total
  const savings_pct = (savings / worst.total) * 100

  return { best, ranked, savings, savings_pct }
}
