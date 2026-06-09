import type { Metadata } from "next"
import InfoPageLayout from "@/components/InfoPageLayout"

export const metadata: Metadata = {
  title: "Programme d'affiliation Amazon | ComparEuro",
  description: "Transparence totale sur notre programme d'affiliation Amazon et son fonctionnement.",
}

export default function AffiliationPage() {
  return (
    <InfoPageLayout
      title="Programme d'affiliation Amazon"
      subtitle="Transparence complète sur notre modèle économique."
      updatedAt="4 juin 2026"
      sections={[
        {
          title: "Ce que vous devez savoir",
          content: (
            <>
              <p>ComparEuro est un <strong>comparateur de prix indépendant</strong>. Nous ne vendons aucun produit. Notre seule source de revenus est le programme d'affiliation Amazon.</p>
              <p style={{ marginTop: 10 }}>Lorsque vous cliquez sur un bouton « Acheter sur Amazon.de » (ou toute autre plateforme Amazon) depuis ComparEuro et effectuez un achat dans les <strong>24 heures</strong>, ComparEuro perçoit une <strong>petite commission d'Amazon</strong>.</p>
              <p style={{ marginTop: 10 }}>Cette commission est entièrement à la charge d'Amazon — vous payez le <strong>même prix</strong> que si vous aviez accédé à Amazon directement.</p>
            </>
          ),
        },
        {
          title: "Quel est le montant de la commission ?",
          content: (
            <>
              <p>Les commissions varient selon les catégories de produits. Pour l'électronique grand public (catégorie principale d'ComparEuro), le taux est généralement de <strong>2,5 % du prix HT</strong> du produit acheté.</p>
              <p style={{ marginTop: 10 }}>Exemple : si vous achetez un casque à 231,50 € sur Amazon.de après avoir cliqué depuis ComparEuro, nous percevons environ <strong>5,78 € de commission</strong>.</p>
            </>
          ),
        },
        {
          title: "Est-ce que ça influence nos comparaisons ?",
          content: (
            <>
              <p><strong>Non.</strong> ComparEuro affiche les prix dans l'ordre du moins cher au plus cher, indépendamment de la commission. Nous ne mettons pas en avant un Amazon plutôt qu'un autre pour des raisons financières.</p>
              <p style={{ marginTop: 10 }}>Notre intérêt est aligné avec le vôtre : si vous économisez, vous achetez, et si vous achetez, nous percevons une commission. Il n'y a aucun avantage pour nous à vous orienter vers un Amazon plus cher.</p>
            </>
          ),
        },
        {
          title: "Les programmes Amazon concernés",
          content: (
            <>
              <p>ComparEuro participe aux programmes Amazon Associates des pays suivants :</p>
              <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
                <li>🇫🇷 <strong>Amazon.fr</strong> — Programme Partenaires Amazon France</li>
                <li>🇩🇪 <strong>Amazon.de</strong> — Amazon PartnerNet Deutschland</li>
                <li>🇪🇸 <strong>Amazon.es</strong> — Programa de Afiliados Amazon España</li>
                <li>🇮🇹 <strong>Amazon.it</strong> — Programma di affiliazione Amazon Italia</li>
                <li>🇳🇱 <strong>Amazon.nl</strong> — Amazon Affiliates Nederland</li>
              </ul>
              <p style={{ marginTop: 10 }}>ComparEuro est un participant indépendant à ces programmes et n'est en aucun cas une entité affiliée, partenaire officiel ou représentante d'Amazon.</p>
            </>
          ),
        },
        {
          title: "Mentions légales obligatoires",
          content: (
            <>
              <p>Conformément aux obligations légales françaises (loi n° 2023-451 du 9 juin 2023 relative à l'influence commerciale) et aux règles du RGPD, ComparEuro s'engage à :</p>
              <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
                <li>Identifier clairement tous les liens d'affiliation sur le site.</li>
                <li>Ne jamais dissimuler la nature commerciale de notre relation avec Amazon.</li>
                <li>Afficher les prix à titre indicatif en mentionnant leur possible variation.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Questions fréquentes",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p><strong>Est-ce que je paye plus cher en passant par ComparEuro ?</strong></p>
                <p>Non. Absolument jamais. Le prix sur Amazon est identique quel que soit votre chemin d'accès.</p>
              </div>
              <div>
                <p><strong>La commission influence-t-elle les résultats affichés ?</strong></p>
                <p>Non. Le classement est uniquement basé sur le prix total (produit + livraison vers la France).</p>
              </div>
              <div>
                <p><strong>ComparEuro est-il propriété d'Amazon ?</strong></p>
                <p>Non. ComparEuro est un site indépendant qui utilise l'API publique d'Amazon.</p>
              </div>
              <div>
                <p><strong>Comment ComparEuro gagne-t-il de l'argent si le service est gratuit ?</strong></p>
                <p>Uniquement via les commissions d'affiliation décrites sur cette page. Il n'y a pas d'abonnement, pas de publicité, pas de revente de données.</p>
              </div>
            </div>
          ),
        },
        {
          title: "Contact",
          content: (
            <p>Des questions sur notre modèle économique ou nos pratiques ? Contactez-nous via la <a href="/contact" style={{ color: "var(--blue)", textDecoration: "underline" }}>page de contact</a> ou à <a href="mailto:contact@compareuro.com" style={{ color: "var(--blue)", textDecoration: "underline" }}>contact@compareuro.com</a>.</p>
          ),
        },
      ]}
    />
  )
}
