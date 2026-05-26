import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// ── In-memory rate limiter ────────────────────────────────────────────────────
// Edge runtime: Map lives per-isolate; fine for Vercel (one isolate per region).
// Each entry: { count: number; windowStart: number }
const RL_MAP = new Map<string, { count: number; windowStart: number }>()

// Prune stale entries every ~500 requests to prevent unbounded growth
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

// ── Security headers added to every dynamic response ─────────────────────────
const SEC_HEADERS: Record<string, string> = {
  "X-Content-Type-Options":  "nosniff",
  "X-Frame-Options":         "DENY",
  "X-XSS-Protection":        "1; mode=block",
  "Referrer-Policy":         "strict-origin-when-cross-origin",
  "Permissions-Policy":      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SEC_HEADERS)) {
    res.headers.set(k, v)
  }
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

  // 1. Block malicious user-agents ───────────────────────────────────────────
  const ua = request.headers.get("user-agent") ?? ""
  if (BAD_UA.test(ua)) return blocked("Forbidden")

  // 2. Derive client IP ──────────────────────────────────────────────────────
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"

  // 3. Auth-route rate limit — 8 req / 60 s ──────────────────────────────────
  const isAuthRoute = pathname === "/connexion" || pathname === "/inscription" ||
                      pathname.startsWith("/api/auth")
  if (isAuthRoute && isRateLimited(`auth:${ip}`, 8, 60_000)) return tooMany()

  // 4. API rate limit — 30 req / 60 s ───────────────────────────────────────
  const isApi = pathname.startsWith("/api/")
  if (isApi && !isAuthRoute && isRateLimited(`api:${ip}`, 30, 60_000)) return tooMany()

  // 5. Global rate limit — 150 req / 60 s ───────────────────────────────────
  if (isRateLimited(`global:${ip}`, 150, 60_000)) return tooMany()

  // 6. Supabase session refresh (required for SSR auth) ─────────────────────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 7. Protect /compte — redirect to /connexion if unauthenticated ───────────
  if (!user && pathname.startsWith("/compte")) {
    const url = request.nextUrl.clone()
    url.pathname = "/connexion"
    url.searchParams.set("redirect", pathname)
    return applySecurityHeaders(NextResponse.redirect(url))
  }

  // 8. Inject security headers into the Supabase response ───────────────────
  applySecurityHeaders(supabaseResponse)

  // 9. Prevent crawlers from indexing auth / private pages ──────────────────
  const noindexPaths = ["/connexion", "/inscription", "/compte", "/auth"]
  if (noindexPaths.some((p) => pathname.startsWith(p))) {
    supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow")
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot|map)).*)",
  ],
}
