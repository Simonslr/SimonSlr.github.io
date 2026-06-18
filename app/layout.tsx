import type { Metadata } from "next"
import { Inter, Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const SW_REGISTER = `
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/api/sw', { scope: '/' })
    .catch(function() {});
}
`
import ToastProvider from "@/components/ToastProvider"
import GrainOverlay from "@/components/GrainOverlay"
import NavigationProgress from "@/components/NavigationProgress"
import HydrationBoundary from "@/components/HydrationBoundary"
import CookieBanner from "@/components/CookieBanner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", weight: ["400", "500", "600", "700"] })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["400", "500"] })
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], variable: "--font-instrument-serif", weight: "400", style: ["normal", "italic"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://eurocomp.vercel.app"),
  title: "ComparEuro — Le vrai prix. Le bon pays.",
  description: "ComparEuro, le comparateur de prix Amazon entre la France, l'Allemagne et l'Espagne. Vendeurs officiels uniquement, livraison incluse, sans inscription.",
  robots: { index: true, follow: true },
  verification: { google: "WagiuAOaaIMxAcLfLEoeJ6xVw9RZ_5Xj3QjR4gqIrF8" },
  other: { google: "notranslate" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" translate="no" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }} suppressHydrationWarning>
        {/* Register Service Worker — injects DOM patch before async bundles on 2nd+ loads */}
        <Script id="sw-register" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: SW_REGISTER }} />
        <HydrationBoundary>
          <ToastProvider>
            <NavigationProgress />
            <GrainOverlay />
            {children}
            <CookieBanner />
          </ToastProvider>
        </HydrationBoundary>
        <Analytics />
      </body>
    </html>
  )
}
