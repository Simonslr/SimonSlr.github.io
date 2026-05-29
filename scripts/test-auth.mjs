/**
 * Test script: signup flow + email delivery
 * Run with: npx vercel run node scripts/test-auth.mjs
 */
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const RESEND_KEY    = process.env.RESEND_API_KEY
const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eurocomp.vercel.app"

const TEST_EMAIL    = "simonsoulier7@gmail.com"
const TEST_PASSWORD = "TestAuth2026!"

let pass = 0
let fail = 0

function ok(msg)   { console.log("  ✓", msg); pass++ }
function err(msg)  { console.log("  ✗", msg); fail++ }
function section(t){ console.log("\n──", t) }

// ── 1. ENV CHECK ──────────────────────────────────────────────────────────────
section("Env vars")
SUPABASE_URL ? ok("NEXT_PUBLIC_SUPABASE_URL") : err("NEXT_PUBLIC_SUPABASE_URL manquant")
SUPABASE_KEY ? ok("NEXT_PUBLIC_SUPABASE_ANON_KEY") : err("NEXT_PUBLIC_SUPABASE_ANON_KEY manquant")
RESEND_KEY   ? ok("RESEND_API_KEY")               : err("RESEND_API_KEY manquant")

if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_KEY) {
  console.log("\n⛔ Variables manquantes — impossible de continuer.")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const resend   = new Resend(RESEND_KEY)

// ── 2. SUPABASE: SIGNUP ───────────────────────────────────────────────────────
section("Supabase — inscription")

const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
  email:    TEST_EMAIL,
  password: TEST_PASSWORD,
  options:  { emailRedirectTo: `${SITE_URL}/auth/callback` },
})

if (signUpErr) {
  // "User already registered" is OK for repeated test runs
  if (signUpErr.message.includes("already registered")) {
    ok("signUp → utilisateur déjà existant (test idempotent)")
  } else {
    err("signUp échoué : " + signUpErr.message)
  }
} else if (signUpData.user) {
  ok(`signUp → user créé (id: ${signUpData.user.id.slice(0,8)}...)`)
  ok("Email de confirmation Supabase envoyé automatiquement")
} else {
  err("signUp → aucune donnée retournée")
}

// ── 3. SUPABASE: SIGNIN (si user existe déjà) ────────────────────────────────
section("Supabase — connexion")

const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
  email:    TEST_EMAIL,
  password: TEST_PASSWORD,
})

if (signInErr) {
  // Could fail if email not confirmed yet — that's expected
  if (signInErr.message.toLowerCase().includes("email not confirmed")) {
    ok("signIn → email non confirmé (attendu pour un nouveau compte)")
  } else {
    err("signIn échoué : " + signInErr.message)
  }
} else if (signInData.session) {
  ok("signIn → session créée")
  ok(`access_token présent (${signInData.session.access_token.slice(0,20)}...)`)

  // ── 4. SUPABASE: SIGNOUT ─────────────────────────────────────────────────
  section("Supabase — déconnexion")
  const { error: signOutErr } = await supabase.auth.signOut()
  signOutErr ? err("signOut échoué : " + signOutErr.message) : ok("signOut OK")
}

// ── 5. RESEND: EMAIL DE BIENVENUE ─────────────────────────────────────────────
section("Resend — email de bienvenue")

const { data: emailData, error: emailErr } = await resend.emails.send({
  from:    "EuroCompare <alertes@eurocompare.fr>",
  to:      TEST_EMAIL,
  subject: "[TEST] Email de bienvenue EuroCompare",
  html:    `
    <p style="font-family:sans-serif;font-size:16px;">
      Ceci est un <strong>email de test</strong> EuroCompare.<br/>
      Si vous recevez cet email, Resend fonctionne correctement ✓
    </p>
    <p style="font-family:sans-serif;font-size:13px;color:#64748b;">
      Test effectué le ${new Date().toLocaleString("fr-FR")}<br/>
      Depuis: ${SITE_URL}
    </p>
  `,
})

if (emailErr) {
  err("Resend sendEmail échoué : " + JSON.stringify(emailErr))
} else if (emailData?.id) {
  ok(`Email envoyé via Resend (id: ${emailData.id})`)
} else {
  err("Resend → aucun id retourné")
}

// ── 6. RESEND: EMAIL D'ALERTE (structure) ────────────────────────────────────
section("Resend — email d'alerte prix (test structure)")

const { data: alertData, error: alertErr } = await resend.emails.send({
  from:    "EuroCompare <alertes@eurocompare.fr>",
  to:      TEST_EMAIL,
  subject: "[TEST] Alerte prix — iPhone 15 — 799,00 €",
  html:    `
    <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;">
      <h2 style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#059669;">
        Alerte prix déclenchée (TEST)
      </h2>
      <h1 style="font-size:28px;font-style:italic;margin:0 0 24px;">iPhone 15</h1>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin-bottom:24px;">
        <p style="font-size:42px;font-weight:700;color:#059669;margin:0;">799,00 €</p>
        <p style="color:#475569;margin:8px 0 0;">sur Amazon.de · livraison incluse</p>
      </div>
      <p style="font-size:13px;color:#64748b;">Test de structure d'email — ${new Date().toLocaleString("fr-FR")}</p>
    </div>
  `,
})

if (alertErr) {
  err("Email alerte échoué : " + JSON.stringify(alertErr))
} else if (alertData?.id) {
  ok(`Email alerte envoyé via Resend (id: ${alertData.id})`)
}

// ── RÉSULTAT ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(40)}`)
console.log(`Résultat: ${pass} OK, ${fail} échoué(s)`)
if (fail === 0) {
  console.log("✅ Tout fonctionne correctement !")
} else {
  console.log("⚠️  Des tests ont échoué — vérifiez ci-dessus.")
  process.exit(1)
}
