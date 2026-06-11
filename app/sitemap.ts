import type { MetadataRoute } from "next"
import products from "@/data/products.json"
import type { Product } from "@/lib/types"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://compareuro.com"
  const now  = new Date().toISOString()

  const productUrls = (products as Product[]).map((p) => ({
    url: `${base}/produit/${p.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }))

  const legalUrls = ["affiliation", "cgu", "confidentialite", "cookies", "mentions-legales", "contact"].map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }))

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/methodologie`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...productUrls,
    ...legalUrls,
  ]
}
