"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isValidSlug, sanitizeName } from "@/lib/security"
import products from "@/data/products.json"

const VALID_SLUGS = new Set((products as Array<{ slug: string }>).map(p => p.slug))

export async function addFavorite(slug: string, name: string) {
  if (!isValidSlug(slug))       return { error: "Produit invalide." }
  if (!VALID_SLUGS.has(slug))   return { error: "Produit introuvable." }

  const cleanName = sanitizeName(name)
  if (!cleanName)               return { error: "Nom du produit invalide." }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  await supabase.from("favorites").upsert(
    { user_id: user.id, product_slug: slug, product_name: cleanName },
    { onConflict: "user_id,product_slug" }
  )

  revalidatePath(`/produit/${slug}`)
  revalidatePath("/compte")
  return { success: true }
}

export async function removeFavorite(slug: string) {
  if (!isValidSlug(slug)) return { error: "Produit invalide." }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  // .eq("user_id", user.id) prevents IDOR
  await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("product_slug", slug)

  revalidatePath(`/produit/${slug}`)
  revalidatePath("/compte")
  return { success: true }
}

export async function getFavorites() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100)         // cap result set

  return data ?? []
}
