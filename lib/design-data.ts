import type { Product, CountryCode } from "./types"
import { getRecommendation } from "./scoring"
import rawProducts from "@/data/products.json"

const products = rawProducts as Product[]

export interface DesignProduct {
  id: string
  slug: string
  brand: string
  title: string
  image: string
  prices: Record<string, number>
  bestCountry: string
  savings: number
  savingsPct: number
  updated: string
  affiliateUrl: string
  affiliateUrls: Record<string, string>
}

export interface DesignFeatured extends DesignProduct {
  description: string
}

export function formatUpdated(updatedAt: string): string {
  const now = new Date()
  const updated = new Date(updatedAt)
  const diffMs = now.getTime() - updated.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 60) {
    return `il y a ${diffMin} min`
  }
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) {
    return `il y a ${diffH} h`
  }
  const diffD = Math.floor(diffH / 24)
  return `il y a ${diffD} j`
}

function toDesignProduct(p: Product): DesignProduct | null {
  const reco = getRecommendation(p)
  if (!reco) return null

  const prices: Record<string, number> = {}
  const affiliateUrls: Record<string, string> = {}

  const countries: CountryCode[] = ["FR", "DE", "ES"]
  let updatedAt = ""

  for (const country of countries) {
    const offer = p.prices[country]
    if (offer && offer.in_stock && offer.price > 0) {
      prices[country] = offer.price + offer.shipping
      affiliateUrls[country] = offer.affiliate_url
      if (!updatedAt) updatedAt = offer.updated_at
    }
  }

  if (Object.keys(prices).length < 2) return null

  const bestCountry = reco.best.country
  const affiliateUrl = affiliateUrls[bestCountry] || Object.values(affiliateUrls)[0]

  // Use updatedAt from the best country offer if available
  const bestOffer = p.prices[bestCountry]
  if (bestOffer) updatedAt = bestOffer.updated_at

  return {
    id: p.id,
    slug: p.slug,
    brand: p.name.split(" ")[0],
    title: p.name,
    image: p.image,
    prices,
    bestCountry,
    savings: reco.savings,
    savingsPct: reco.savings_pct,
    updated: updatedAt ? formatUpdated(updatedAt) : "récemment",
    affiliateUrl,
    affiliateUrls,
  }
}

export function getCatalogueProducts(): DesignProduct[] {
  const result: DesignProduct[] = []
  for (const p of products) {
    const dp = toDesignProduct(p)
    if (dp) result.push(dp)
  }
  // Sort by savings descending
  result.sort((a, b) => b.savings - a.savings)
  return result
}

export function getFeaturedProduct(): DesignFeatured | null {
  const catalogue = getCatalogueProducts()
  if (catalogue.length === 0) return null

  // Highest savings product
  const best = catalogue[0]
  const original = products.find((p) => p.id === best.id)
  if (!original) return null

  return {
    ...best,
    description: original.description,
  }
}
