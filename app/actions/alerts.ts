"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isValidSlug, isValidCountry, isValidTargetPrice, isValidPrice, sanitizeName } from "@/lib/security"
import products from "@/data/products.json"

// Whitelist of valid slugs derived from the static product catalogue
const VALID_SLUGS = new Set((products as Array<{ slug: string }>).map(p => p.slug))

export async function createAlert(
  slug: string,
  name: string,
  targetPrice: number,
  country: string,
  currentPrice: number
) {
  // ── Input validation ───────────────────────────────────────────────────────
  if (!isValidSlug(slug))           return { error: "Produit invalide." }
  if (!VALID_SLUGS.has(slug))       return { error: "Produit introuvable." }
  if (!isValidCountry(country))     return { error: "Pays invalide." }
  if (!isValidTargetPrice(targetPrice)) return { error: "Prix cible invalide." }
  if (!isValidPrice(currentPrice))  return { error: "Prix actuel invalide." }

  const cleanName = sanitizeName(name)
  if (!cleanName)                   return { error: "Nom du produit invalide." }

  // ── Auth ───────────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  // ── Rate limit: max 10 active alerts per user ──────────────────────────────
  const { count } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("triggered", false)
  if ((count ?? 0) >= 10) return { error: "Limite de 10 alertes actives atteinte." }

  // ── Insert ─────────────────────────────────────────────────────────────────
  const { error } = await supabase.from("alerts").insert({
    user_id:            user.id,
    product_slug:       slug,
    product_name:       cleanName,
    target_price:       targetPrice,
    best_country:       country,
    current_best_price: currentPrice,
  })

  if (error) return { error: "Impossible de créer l'alerte." }
  revalidatePath(`/produit/${slug}`)
  revalidatePath("/compte")
  return { success: true }
}

export async function deleteAlert(alertId: string) {
  // alertId is a UUID — validate format to prevent odd inputs
  if (typeof alertId !== "string" || !/^[0-9a-f-]{36}$/i.test(alertId)) {
    return { error: "Identifiant invalide." }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  // .eq("user_id", user.id) prevents IDOR — user can only delete their own alerts
  await supabase
    .from("alerts")
    .delete()
    .eq("id", alertId)
    .eq("user_id", user.id)

  revalidatePath("/compte")
  return { success: true }
}

export async function getAlerts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)           // cap result set

  return data ?? []
}
