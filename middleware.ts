import { NextResponse, type NextRequest } from "next/server"

// ── In-memory rate limiter ────────────────────────────────────────────────────
const RL_MAP = new Map<string, { count: number; windowStart: number }>()
let _pruneCount = 0

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = RL_MAP.get(key)

  if (!entry || now - entry.windowStart >= windowMs) {
    RL_MAP.set(key, { count: 1, windowStart: now })
    return false
  }

  entry.count++
  if (entry.count > limit) return true

  if (++_pruneCount > 500) {
    _pruneCount = 0
    for (const [k, v] of RL_MAP) {
      if (now - v.windowStart >= windowMs) RL_MAP.delete(k)
    }
  }

  return false
}

// ── Bot / scanner UA blocklist ────────────────────────────────────────────────
const BAD_UA = /sqlmap|nikto|nmap|masscan|zgrab|nuclei|dirbuster|gobuster|wfuzz|hydra|medusa|burpsuite|metasploit|havij|acunetix|appscan|nessus|openvas|whatweb|httprint|w3af|skipfish|fimap|commix|xsser|dalfox|wapiti|joomscan|droopescan|vega|paros|webscarab|owasp[\s_-]?zap|python-requests\/[01]\.|go-http-client\/1\.|curl\/[0-6]\.|libwww-perl|lwp-trivial|python-urllib\/[12]\.|peach|netsparker|grendel-scan|webinspect|appscan|nexpose|canvas/i

// ── Security headers ──────────────────────────────────────────────────────────
const SEC_HEADERS: Record<string, string> = {
  "X-Content-Type-Options":  "nosniff",
  "X-Frame-Options":         "DENY",
  "X-XSS-Protection":        "1; mode=block",
  "Referrer-Policy":         "strict-origin-when-cross-origin",
  "Permissions-Policy":      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SEC_HEADERS)) res.headers.set(k, v)
  return res
}

function blocked(reason: string): NextResponse {
  return applySecurityHeaders(
    new NextResponse(reason, { status: 403, headers: { "Content-Type": "text/plain" } })
  )
}

function tooMany(): NextResponse {
  return applySecurityHeaders(
    new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Content-Type": "text/plain", "Retry-After": "60" },
    })
  )
}

// ── Main middleware ───────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Block malicious user-agents
  const ua = request.headers.get("user-agent") ?? ""
  if (BAD_UA.test(ua)) return blocked("Forbidden")

  // 2. Derive client IP
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"

  // 3. API rate limit — 30 req / 60 s
  const isApi = pathname.startsWith("/api/")
  if (isApi && isRateLimited(`api:${ip}`, 30, 60_000)) return tooMany()

  // 4. Global rate limit — 150 req / 60 s
  if (isRateLimited(`global:${ip}`, 150, 60_000)) return tooMany()

  const res = NextResponse.next({ request })
  return applySecurityHeaders(res)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot|map)).*)",
  ],
}
