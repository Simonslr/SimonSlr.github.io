import type { Metadata } from "next"
import InfoPageLayout from "@/components/InfoPageLayout"

export const metadata: Metadata = {
  title: "Politique de confidentialité | EuroCompare",
}

export default function ConfidentialitePage() {
  return (
    <InfoPageLayout
      title="Politique de confidentialité"
      subtitle="Comment nous traitons vos données personnelles."
      updatedAt="7 mai 2026"
      sections={[
        {
          title: "Données collectées",
          content: (
            <>
              <p>EuroCompare est conçu pour respecter votre vie privée. <strong>Nous ne collectons aucune donnée personnelle</strong> vous identifiant directement (nom, email, adresse, etc.) lors de votre simple navigation sur le site.</p>
              <p>Le site ne requiert aucune création de compte ni inscription pour accéder à ses fonctionnalités.</p>
            </>
          ),
        },
        {
          title: "Données techniques",
          content: (
            <>
              <p>À des fins de bon fonctionnement et de sécurité, notre hébergeur (Vercel) peut enregistrer certaines données techniques anonymisées : adresse IP, type de navigateur, pages visitées, date et heure d'accès. Ces données ne sont pas utilisées à des fins commerciales et sont conservées conformément à la politique de confidentialité de Vercel.</p>
            </>
          ),
        },
        {
          title: "Liens affiliés Amazon",
          content: (
            <>
              <p>Lorsque vous cliquez sur un lien Amazon depuis EuroCompare, vous êtes redirigé vers le site Amazon. Amazon peut alors collecter des données vous concernant selon sa propre politique de confidentialité. EuroCompare n'a aucun accès à ces données.</p>
              <p>Amazon peut déposer des cookies sur votre navigateur via ces liens affiliés. Consultez la <a href="https://www.amazon.fr/gp/help/customer/display.html?nodeId=201909010" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">politique de confidentialité d'Amazon</a> pour plus d'informations.</p>
            </>
          ),
        },
        {
          title: "Vos droits",
          content: (
            <>
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.</p>
              <p>Pour exercer ces droits ou pour toute question relative à la protection de vos données, contactez-nous à : <a href="mailto:contact@eurocompare.fr" className="text-indigo-600 hover:underline">contact@eurocompare.fr</a></p>
            </>
          ),
        },
        {
          title: "Modifications",
          content: (
            <p>Cette politique de confidentialité peut être mise à jour à tout moment. La date de dernière modification est indiquée en haut de cette page. Nous vous encourageons à la consulter régulièrement.</p>
          ),
        },
      ]}
    />
  )
}
