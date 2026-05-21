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

export default function HomePage() {
  return (
    <div>
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
