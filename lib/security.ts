/**
 * Shared security utilities.
 * Keep this file free of external dependencies so it works in both
 * Node.js runtime (Server Actions) and Edge runtime (middleware, API routes).
 */

// ── HTML escaping ─────────────────────────────────────────────────────────────
// Prevents XSS when embedding user-controlled data in HTML strings (emails, etc.)
export function htmlEscape(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

// ── Safe JSON-LD serialisation ────────────────────────────────────────────────
// JSON.stringify does NOT escape </script>, so embedding it in <script> tags is
// vulnerable to script-tag breakout. Replacing < > & neutralises the attack.
export function safeJsonLd(data: unknown): string {
  const raw = JSON.stringify(data)
  let out = ''
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (ch === '<')  { out += '<'; continue }
    if (ch === '>')  { out += '>'; continue }
    if (ch === '&')  { out += '&'; continue }
    out += ch
  }
  return out
}

// ── Timing-safe string comparison ────────────────────────────────────────────
// Standard !== leaks timing info char-by-char. Use for secrets (CRON_SECRET etc.)
// Works in both Node.js and Edge runtimes (no Buffer needed).
export function timingSafeCompare(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const aBuf = enc.encode(a)
  const bBuf = enc.encode(b)
  // XOR the lengths first so a length mismatch is always caught
  let diff = aBuf.length ^ bBuf.length
  const len = Math.max(aBuf.length, bBuf.length)
  for (let i = 0; i < len; i++) {
    diff |= (aBuf[i] ?? 0) ^ (bBuf[i] ?? 0)
  }
  return diff === 0
}

// ── Input validators ──────────────────────────────────────────────────────────

/** Product slug: lowercase alphanumeric + hyphens, 1-100 chars */
export function isValidSlug(slug: unknown): slug is string {
  return (
    typeof slug === "string" &&
    slug.length >= 1 &&
    slug.length <= 100 &&
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(slug)
  )
}

/** Country: only the three markets we support */
export function isValidCountry(country: unknown): country is "FR" | "DE" | "ES" {
  return country === "FR" || country === "DE" || country === "ES"
}

/** Price: positive finite number up to 99 999 € */
export function isValidPrice(price: unknown): price is number {
  return (
    typeof price === "number" &&
    Number.isFinite(price) &&
    price > 0 &&
    price < 100_000
  )
}

/** Alert target price: 1 cent minimum, same 99 999 € ceiling */
export function isValidTargetPrice(price: unknown): price is number {
  return (
    typeof price === "number" &&
    Number.isFinite(price) &&
    price >= 0.01 &&
    price < 100_000
  )
}

/** Name: strip HTML tags, collapse whitespace, enforce max length */
export function sanitizeName(name: unknown): string {
  if (typeof name !== "string") return ""
  return name
    .replace(/<[^>]*>/g, "")  // strip any HTML tags
    .replace(/\s+/g, " ")     // collapse whitespace
    .trim()
    .slice(0, 200)
}

/** Only allow HTTPS affiliate / product URLs */
export function isHttpsUrl(url: unknown): boolean {
  if (typeof url !== "string" || !url) return false
  try {
    const u = new URL(url)
    return u.protocol === "https:"
  } catch {
    return false
  }
}
