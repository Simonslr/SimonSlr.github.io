import type { Metadata } from "next"
import IntroSplash      from "@/components/IntroSplash"
import DesignNavbar     from "@/components/DesignNavbar"
import HeroText         from "@/components/HeroText"
import EuroMapClient    from "@/components/EuroMapClient"
import DesignMethod     from "@/components/DesignMethod"
import DesignFeatured   from "@/components/DesignFeatured"
import DesignCatalogue  from "@/components/DesignCatalogue"
import DesignTrust      from "@/components/DesignTrust"
import DesignCTAFinal   from "@/components/DesignCTAFinal"
import SmoothScroll     from "@/components/SmoothScroll"
import ScrollAnimations from "@/components/ScrollAnimations"

export const metadata: Metadata = {
  title: "EuroCompare — Le même produit, moins cher en Europe",
  description: "Comparez les prix Amazon France, Allemagne et Espagne. Livraison incluse, vendeurs officiels, sans inscription. Économisez jusqu'à 30% sur vos achats tech.",
  keywords: ["comparateur prix amazon", "amazon france allemagne espagne", "meilleur prix amazon", "économiser amazon europe"],
  openGraph: {
    title: "EuroCompare — Le même produit, moins cher en Europe",
    description: "Comparez les prix Amazon FR, DE, ES. Livraison incluse, vendeurs officiels.",
    type: "website",
    locale: "fr_FR",
  },
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eurocomp.vercel.app"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      "url": SITE,
      "name": "EuroCompare",
      "description": "Comparez les prix Amazon France, Allemagne et Espagne. Livraison incluse, vendeurs officiels.",
      "inLanguage": "fr-FR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${SITE}/#catalogue` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      "name": "EuroCompare",
      "url": SITE,
      "description": "Comparateur de prix Amazon entre la France, l'Allemagne et l'Espagne.",
    },
    {
      "@type": "SiteNavigationElement",
      "name": ["Catalogue", "Comment ça marche", "Comparateur"],
      "url": [`${SITE}/#catalogue`, `${SITE}/#methode`, `${SITE}/#comparateur`],
    },
  ],
}

export default function HomePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SmoothScroll />
      <ScrollAnimations />
      <IntroSplash />
      <DesignNavbar />
      <main>
        <HeroText />
        <EuroMapClient />
        <DesignMethod />
        <DesignFeatured />
        <DesignCatalogue />
        <DesignTrust />
        <DesignCTAFinal />
      </main>
    </div>
  )
}
