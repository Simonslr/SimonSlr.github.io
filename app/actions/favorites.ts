"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addFavorite(slug: string, name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  await supabase.from("favorites").upsert(
    { user_id: user.id, product_slug: slug, product_name: name },
    { onConflict: "user_id,product_slug" }
  )

  revalidatePath(`/produit/${slug}`)
  revalidatePath("/compte")
  return { success: true }
}

export async function removeFavorite(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

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

  return data ?? []
}
