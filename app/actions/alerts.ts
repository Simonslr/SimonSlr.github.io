"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createAlert(
  slug: string,
  name: string,
  targetPrice: number,
  country: string,
  currentPrice: number
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

  // Rate limit: max 10 active alerts per user
  const { count } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("triggered", false)
  if ((count ?? 0) >= 10) return { error: "Limite de 10 alertes actives atteinte." }

  const { error } = await supabase.from("alerts").insert({
    user_id:            user.id,
    product_slug:       slug,
    product_name:       name,
    target_price:       targetPrice,
    best_country:       country,
    current_best_price: currentPrice,
  })

  if (error) return { error: error.message }
  revalidatePath(`/produit/${slug}`)
  revalidatePath("/compte")
  return { success: true }
}

export async function deleteAlert(alertId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non connecté" }

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

  return data ?? []
}
