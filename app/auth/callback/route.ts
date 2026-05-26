import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code       = searchParams.get("code")
  const tokenHash  = searchParams.get("token_hash")
  const type       = searchParams.get("type") as "signup" | "magiclink" | "email" | null
  const rawNext    = searchParams.get("next") ?? "/compte"
  // Prevent open redirect: must be same-site relative path
  const next       = rawNext.startsWith("/") && !rawNext.startsWith("//") && !/[\r\n]/.test(rawNext)
    ? rawNext : "/compte"
  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()    { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // PKCE flow (OAuth + newer Supabase email confirmation)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${siteUrl}${next}`)
  }

  // OTP flow (magic link + older Supabase email confirmation)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) return NextResponse.redirect(`${siteUrl}${next}`)
  }

  return NextResponse.redirect(`${siteUrl}/connexion?error=auth`)
}
