"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sendWelcomeEmail } from "@/lib/emails"

// Basic server-side guards — HTML validation can be bypassed via direct POST
function parseEmail(formData: FormData): string | null {
  const v = (formData.get("email") as string | null)?.trim() ?? ""
  if (!v || v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return null
  return v.toLowerCase()
}

function parsePassword(formData: FormData): string | null {
  const v = (formData.get("password") as string | null) ?? ""
  if (!v || v.length < 6 || v.length > 128) return null
  return v
}

// Only allow same-site relative paths for redirect targets
function safeRedirectTarget(raw: string | null): string {
  if (!raw) return "/compte"
  const path = raw.startsWith("/") ? raw : `/${raw}`
  // Block protocol-relative (//) and any embedded newlines
  if (path.startsWith("//") || /[\r\n]/.test(path)) return "/compte"
  return path
}

export async function signUp(formData: FormData) {
  const email    = parseEmail(formData)
  const password = parsePassword(formData)
  if (!email || !password) redirect("/inscription?error=" + encodeURIComponent("Données invalides."))

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: email!,
    password: password!,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) redirect(`/inscription?error=${encodeURIComponent(error.message)}`)
  await sendWelcomeEmail(email!).catch(() => null)
  redirect("/inscription?success=1")
}

export async function signIn(formData: FormData) {
  const email    = parseEmail(formData)
  const password = parsePassword(formData)
  if (!email || !password) redirect("/connexion?error=1")

  const redirectTo = safeRedirectTarget(formData.get("redirectTo") as string | null)
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email: email!, password: password! })

  if (error) redirect("/connexion?error=1")
  revalidatePath("/", "layout")
  redirect(redirectTo)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function sendMagicLink(formData: FormData) {
  const email = parseEmail(formData)
  if (!email) redirect("/connexion?error=magic")

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email: email!,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) redirect("/connexion?error=magic")
  redirect("/connexion?magic=1")
}
