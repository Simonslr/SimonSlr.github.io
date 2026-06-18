import type { Metadata } from "next"
import InfoPageLayout from "@/components/InfoPageLayout"

export const metadata: Metadata = {
  title: "Méthodologie — Comment on compare les prix | ComparEuro",
  description: "Découvrez comment ComparEuro collecte, calcule et présente les prix Amazon entre la France, l'Allemagne et l'Espagne.",
}

export default function MethodologiePage() {
  return (
    <InfoPageLayout
      title="Méthodologie"
      subtitle="Comment notre comparateur de prix collecte, calcule et affiche les économies."
      updatedAt="7 mai 2026"
      sections={[
        {
          title: "Sources de données",
          content: (
            <>
              <p>ComparEuro collecte les prix directement sur les pages produits des boutiques Amazon officielles de chaque pays : Amazon.fr (France), Amazon.de (Allemagne) et Amazon.es (Espagne).</p>
              <p>Seuls les produits vendus et expédiés par Amazon lui-même ou par des marques officielles sont inclus. Les vendeurs tiers de la marketplace Amazon ne sont pas pris en compte, afin de garantir la fiabilité des prix et la présence d'une garantie constructeur.</p>
            </>
          ),
        },
        {
          title: "Calcul du prix total",
          content: (
            <>
              <p>Le prix affiché sur ComparEuro est toujours le <strong>prix total livré en France</strong>, c'est-à-dire :</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Prix du produit TTC tel qu'affiché sur le site Amazon du pays concerné</li>
                <li>Frais de livraison standard vers la France métropolitaine (estimés ou réels selon la disponibilité)</li>
              </ul>
              <p className="mt-3">Les frais de douane ne sont <strong>pas</strong> inclus dans notre calcul. En tant que membre de l'Union Européenne, les achats entre États membres ne sont pas soumis à des droits de douane, mais des différences de TVA peuvent s'appliquer dans certains cas. Nous vous recommandons de vérifier le montant final au moment du paiement.</p>
            </>
          ),
        },
        {
          title: "Fréquence de mise à jour",
          content: (
            <>
              <p>Les prix sont vérifiés et mis à jour régulièrement. La date de dernière mise à jour est indiquée sur chaque fiche produit. Les prix Amazon peuvent varier plusieurs fois par jour, notamment lors des périodes de promotions (Prime Day, Black Friday, soldes, etc.).</p>
              <p><strong>Important :</strong> Vérifiez toujours le prix affiché sur le site Amazon au moment de votre achat. ComparEuro ne peut garantir que le prix affiché sur notre site correspond exactement au prix réel au moment de votre commande.</p>
            </>
          ),
        },
        {
          title: "Sélection des produits",
          content: (
            <p>Les produits présentés sur ComparEuro sont sélectionnés manuellement sur la base de leur popularité, des économies potentielles identifiées et de leur disponibilité dans les trois pays couverts. Nous privilégions les produits pour lesquels l'écart de prix entre pays est significatif et vérifiable.</p>
          ),
        },
        {
          title: "Liens affiliés",
          content: (
            <p>ComparEuro participe au programme Partenaires d'Amazon EU. Les liens vers Amazon présents sur ce site sont des liens affiliés : si vous achetez un produit via l'un de ces liens, ComparEuro perçoit une commission sur la vente, sans coût supplémentaire pour vous. Cette commission nous permet de financer le développement et la maintenance du site.</p>
          ),
        },
      ]}
    />
  )
}
