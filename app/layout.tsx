import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EuroPrix — Comparez les prix Amazon en Europe, livraison incluse",
  description: "Économisez jusqu'à 30% en comparant les prix Amazon entre France, Allemagne et Espagne. Livraison incluse, vendeurs officiels uniquement.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.className} bg-slate-50 min-h-screen`}>
        <Navbar />
        {children}
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
                  <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-700">EuroPrix</span>
            </div>
            <p className="text-xs text-slate-400 text-center">
              Site partenaire Amazon · Prix livraison estimée vers la France · Vérifiez le prix final avant d&apos;acheter
            </p>
            <p className="text-xs text-slate-400">© 2026</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
