export type CountryCode = "FR" | "DE" | "ES"

export interface Offer {
  price: number
  shipping: number
  seller: string
  in_stock: boolean
  affiliate_url: string
  updated_at: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  image: string
  description: string
  prices: Partial<Record<CountryCode, Offer>>
}

export interface RankedOffer {
  country: CountryCode
  total: number
  offer: Offer
}

export interface Recommendation {
  best: RankedOffer
  ranked: RankedOffer[]
  savings: number
  savings_pct: number
}
