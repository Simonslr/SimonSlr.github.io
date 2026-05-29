import type { Metadata } from "next"
import { Space_Grotesk, Inter, JetBrains_Mono, Fraunces } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import ToastProvider from "@/components/ToastProvider"
import GrainOverlay from "@/components/GrainOverlay"
import NavigationProgress from "@/components/NavigationProgress"
import HydrationBoundary from "@/components/HydrationBoundary"

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

// Intercepts DOM mutation errors thrown during React 19 hydration recovery BEFORE
// Chrome's renderer sees them. Must run before hydrateRoot — beforeInteractive
// guarantees this. Returns the node argument so React doesn't get undefined back.
const DOM_PATCH = [
  "try{",
  "var _ib=Node.prototype.insertBefore;",
  "Node.prototype.insertBefore=function(n,r){try{return _ib.call(this,n,r)}catch(e){if(e&&(e.name==='NotFoundError'||e.name==='HierarchyRequestError'))return n;throw e}};",
  "var _rc=Node.prototype.removeChild;",
  "Node.prototype.removeChild=function(n){try{return _rc.call(this,n)}catch(e){if(e&&(e.name==='NotFoundError'||e.name==='HierarchyRequestError'))return n;throw e}};",
  "var _rp=Node.prototype.replaceChild;",
  "Node.prototype.replaceChild=function(n,o){try{return _rp.call(this,n,o)}catch(e){if(e&&(e.name==='NotFoundError'||e.name==='HierarchyRequestError'))return o;throw e}};",
  "}catch(e){}",
].join("")

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" translate="no" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }} suppressHydrationWarning>
        <Script id="dom-node-patch" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: DOM_PATCH }} />
        <HydrationBoundary>
          <ToastProvider>
            <NavigationProgress />
            <GrainOverlay />
            {children}
          </ToastProvider>
        </HydrationBoundary>
      </body>
    </html>
  )
}
