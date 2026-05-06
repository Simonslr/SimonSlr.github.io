import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import EuroPrixLogo from "@/components/EuroPrixLogo"
import Link from "next/link"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EuroPrix — Comparez les prix Amazon en Europe, livraison incluse",
  description: "Économisez jusqu'à 30% en comparant les prix Amazon entre France, Allemagne et Espagne. Livraison incluse, vendeurs officiels uniquement.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={geist.className} style={{ background: "#fff", minHeight: "100vh" }}>
        <Navbar />
        {children}
        <footer style={{ borderTop: "1px solid #E2E8F0", padding: "56px 56px 40px", background: "#fff" }}>
          <div className="max-w-screen-xl mx-auto grid gap-10" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            <div style={{ gridColumn: "span 2" }}>
              <EuroPrixLogo size={36} />
              <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-md">
                EuroPrix participe au programme Partenaires Amazon EU, un programme d'affiliation conçu pour permettre
                à des sites de percevoir une rémunération grâce à la création de liens vers Amazon.
                EuroPrix n'est pas affilié à Amazon en dehors de ce programme.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4 font-mono">
                Produit
              </div>
              {[
                { label: "Catalogue",          href: "/#products" },
                { label: "Comment ça marche",  href: "/#how-it-works" },
                { label: "Méthodologie",        href: "/methodologie" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="block text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors mb-2.5 no-underline">
                  {label}
                </Link>
              ))}
            </div>

            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4 font-mono">
                Légal
              </div>
              {[
                { label: "Mentions légales",  href: "/mentions-legales" },
                { label: "Confidentialité",   href: "/confidentialite" },
                { label: "Cookies",           href: "/cookies" },
                { label: "Contact",           href: "/contact" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="block text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors mb-2.5 no-underline">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div
            className="max-w-screen-xl mx-auto flex items-center justify-between text-xs text-slate-400 mt-8 pt-6"
            style={{ borderTop: "1px solid #F1F5F9" }}
          >
            <span>© 2026 EuroPrix. Site partenaire Amazon.</span>
            <span className="font-mono tracking-wider">Made in Europe 🇪🇺</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
