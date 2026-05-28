import type { NextConfig } from "next"

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",               // Next.js App Router requires unsafe-inline for hydration chunks
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.ssl-images-amazon.com https://m.media-amazon.com https://images-eu.ssl-images-amazon.com https://images-na.ssl-images-amazon.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ")

const SECURITY_HEADERS = [
  { key: "X-DNS-Prefetch-Control",    value: "on" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy",   value: CSP },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-eu.ssl-images-amazon.com" },
    ],
  },
  headers: async () => [
    { source: "/(.*)", headers: SECURITY_HEADERS },
    // Serve cached HTML immediately even if stale, revalidate in background.
    // Stale chunks trigger the ChunkLoadError auto-reload in HydrationBoundary.
    // This is more resilient than must-revalidate on poor/mobile connections.
    {
      source: "/((?!_next).*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=0, stale-while-revalidate=604800" }],
    },
  ],
  // Désactive l'affichage de la version Next.js dans les réponses HTTP
  poweredByHeader: false,
}

export default nextConfig
