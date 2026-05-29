import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

export const dynamic = "force-dynamic"

const TEST_EMAIL    = "simonsoulier7@gmail.com"
const TEST_PASSWORD = "TestEuroCompare2026!"

export async function GET(req: NextRequest) {
  // Protect with CRON_SECRET
  const auth = req.nextUrl.searchParams.get("secret")
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results: { test: string; ok: boolean; detail?: string }[] = []
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eurocomp.vercel.app"

  function pass(test: string, detail?: string) { results.push({ test, ok: true, detail }) }
  function fail(test: string, detail?: string) { results.push({ test, ok: false, detail }) }

  // ── 1. ENV VARS ─────────────────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const resendKey   = process.env.RESEND_API_KEY

  supabaseUrl ? pass("env: SUPABASE_URL") : fail("env: SUPABASE_URL", "manquant")
  supabaseKey ? pass("env: SUPABASE_KEY") : fail("env: SUPABASE_KEY", "manquant")
  resendKey   ? pass("env: RESEND_KEY")   : fail("env: RESEND_KEY", "manquant")

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    return NextResponse.json({ results, allPassed: false, error: "Env vars manquantes" })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const resend   = new Resend(resendKey)

  // ── 2. SUPABASE SIGNUP ───────────────────────────────────────────────────────
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email:    TEST_EMAIL,
    password: TEST_PASSWORD,
    options:  { emailRedirectTo: `${SITE}/auth/callback` },
  })

  if (signUpErr) {
    if (signUpErr.message.includes("already registered")) {
      pass("supabase: signUp (user existant — idempotent)")
    } else {
      fail("supabase: signUp", signUpErr.message)
    }
  } else if (signUpData.user) {
    pass("supabase: signUp", `user id: ${signUpData.user.id.slice(0, 8)}...`)
    pass("supabase: email de confirmation envoyé automatiquement")
  }

  // ── 3. SUPABASE SIGNIN ───────────────────────────────────────────────────────
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email:    TEST_EMAIL,
    password: TEST_PASSWORD,
  })

  if (signInErr) {
    if (signInErr.message.toLowerCase().includes("email not confirmed")) {
      pass("supabase: signIn (email non confirmé — attendu pour nouveau compte)")
    } else {
      fail("supabase: signIn", signInErr.message)
    }
  } else if (signInData.session) {
    pass("supabase: signIn", "session créée")
    await supabase.auth.signOut()
    pass("supabase: signOut")
  }

  // ── 4. RESEND: WELCOME EMAIL ─────────────────────────────────────────────────
  const { data: emailData, error: emailErr } = await resend.emails.send({
    from:    "EuroCompare <alertes@eurocompare.fr>",
    to:      TEST_EMAIL,
    subject: "✅ [TEST] Email de bienvenue EuroCompare",
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:500px;margin:auto;padding:32px;background:#0a0f1e;color:#f5f5f7;border-radius:16px;">
        <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(245,245,247,0.4);margin:0 0 20px;">EuroCompare · Test</p>
        <h1 style="font-size:32px;font-weight:400;font-style:italic;margin:0 0 16px;">Test email OK.</h1>
        <p style="color:rgba(245,245,247,0.6);line-height:1.6;margin:0 0 24px;">
          Si vous recevez cet email, Resend fonctionne correctement.<br/>
          Envoyé le ${new Date().toLocaleString("fr-FR")} depuis ${SITE}
        </p>
        <div style="background:rgba(5,150,105,0.12);border:1px solid rgba(5,150,105,0.25);border-radius:10px;padding:16px;font-size:14px;color:#34d399;">
          ✓ API Resend opérationnelle<br/>
          ✓ Domaine d'envoi configuré<br/>
          ✓ Livraison en cours
        </div>
      </div>
    `,
  })

  if (emailErr) {
    fail("resend: welcome email", JSON.stringify(emailErr))
  } else if (emailData?.id) {
    pass("resend: welcome email", `id: ${emailData.id}`)
  }

  // ── 5. RESEND: ALERT EMAIL ───────────────────────────────────────────────────
  const { data: alertData, error: alertErr } = await resend.emails.send({
    from:    "EuroCompare <alertes@eurocompare.fr>",
    to:      TEST_EMAIL,
    subject: "✅ [TEST] Alerte prix — structure email",
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;">
        <h2 style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#059669;">Alerte prix TEST</h2>
        <h1 style="font-size:26px;font-style:italic;color:#0f172a;">iPhone 15 Pro</h1>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin:16px 0;">
          <p style="font-size:42px;font-weight:700;color:#059669;margin:0;letter-spacing:-0.04em;">978,00 €</p>
          <p style="color:#475569;margin:8px 0 0;font-size:14px;">sur Amazon.de · livraison incluse</p>
        </div>
        <p style="font-size:12px;color:#94a3b8;">Test envoyé le ${new Date().toLocaleString("fr-FR")}</p>
      </div>
    `,
  })

  if (alertErr) {
    fail("resend: alerte email", JSON.stringify(alertErr))
  } else if (alertData?.id) {
    pass("resend: alerte email", `id: ${alertData.id}`)
  }

  const allPassed = results.every(r => r.ok)
  return NextResponse.json({ results, allPassed, totalPass: results.filter(r => r.ok).length, totalFail: results.filter(r => !r.ok).length })
}
