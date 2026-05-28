import type { Metadata } from "next"
import { Space_Grotesk, Inter, JetBrains_Mono, Fraunces } from "next/font/google"
import "./globals.css"
import ToastProvider from "@/components/ToastProvider"
import GrainOverlay from "@/components/GrainOverlay"
import NavigationProgress from "@/components/NavigationProgress"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://eurocomp.vercel.app"),
  title: "EuroCompare — Le vrai prix. Le bon pays.",
  description: "Comparez les prix Amazon entre la France, l'Allemagne et l'Espagne. Vendeurs officiels uniquement, livraison incluse, sans inscription.",
  robots: { index: true, follow: true },
  verification: { google: "WagiuAOaaIMxAcLfLEoeJ6xVw9RZ_5Xj3QjR4gqIrF8" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}>
      <body style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}>
        <ToastProvider>
          <NavigationProgress />
          <GrainOverlay />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
