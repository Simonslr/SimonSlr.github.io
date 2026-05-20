"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sendWelcomeEmail } from "@/lib/emails"

export async function signUp(formData: FormData) {
  const email    = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) redirect(`/inscription?error=${encodeURIComponent(error.message)}`)
  // Welcome email — no-op if RESEND_API_KEY not set
  await sendWelcomeEmail(email).catch(() => null)
  redirect("/inscription?success=1")
}

export async function signIn(formData: FormData) {
  const email    = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = formData.get("redirectTo") as string | null
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) redirect("/connexion?error=1")
  revalidatePath("/", "layout")
  redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/compte")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function sendMagicLink(formData: FormData) {
  const email    = formData.get("email") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) redirect("/connexion?error=magic")
  redirect("/connexion?magic=1")
}
