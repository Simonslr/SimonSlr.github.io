import type { MetadataRoute } from "next"
import products from "@/data/products.json"
import type { Product } from "@/lib/types"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://eurocompare.fr"

  const productUrls = (products as Product[]).map((p) => ({
    url: `${base}/produit/${p.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }))

  return [
    { url: base, lastModified: new Date().toISOString(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/methodologie`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.5 },
    ...productUrls,
  ]
}
