import type { Metadata } from "next"
import InfoPageLayout from "@/components/InfoPageLayout"

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | CompareUro",
  description: "Conditions d'utilisation du service CompareUro — comparateur de prix Amazon Europe.",
}

export default function CGUPage() {
  return (
    <InfoPageLayout
      title="Conditions Générales d'Utilisation"
      subtitle="En utilisant CompareUro, vous acceptez les présentes conditions."
      updatedAt="4 juin 2026"
      sections={[
        {
          title: "1. Présentation du service",
          content: (
            <>
              <p>CompareUro (ci-après « le Service ») est un comparateur de prix indépendant permettant aux utilisateurs de consulter et comparer les prix d'un même produit sur différentes plateformes Amazon européennes (Amazon.fr, Amazon.de, Amazon.es, Amazon.it, Amazon.nl).</p>
              <p style={{ marginTop: 10 }}>CompareUro n'est pas une boutique en ligne. Il ne vend aucun produit et ne collecte aucun paiement. Les achats sont réalisés directement sur les plateformes Amazon concernées.</p>
            </>
          ),
        },
        {
          title: "2. Accès au service",
          content: (
            <>
              <p>L'accès au Service est gratuit et ouvert à tout utilisateur disposant d'un accès Internet. Aucune inscription n'est requise pour consulter les comparaisons de prix.</p>
              <p style={{ marginTop: 10 }}>CompareUro se réserve le droit de modifier, suspendre ou interrompre tout ou partie du Service à tout moment, sans préavis, notamment pour des raisons de maintenance ou d'évolution technique.</p>
            </>
          ),
        },
        {
          title: "3. Exactitude des informations",
          content: (
            <>
              <p>Les prix affichés sur CompareUro sont fournis à titre <strong>indicatif</strong>. Ils proviennent de l'API officielle Amazon (Amazon Product Advertising API) et sont mis à jour régulièrement, mais peuvent ne pas refléter le prix exact au moment de votre achat en raison :</p>
              <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
                <li>des fluctuations de prix en temps réel sur Amazon,</li>
                <li>des variations de frais de livraison selon votre adresse,</li>
                <li>des promotions ponctuelles non capturées,</li>
                <li>des délais de mise à jour de l'API.</li>
              </ul>
              <p style={{ marginTop: 10 }}>CompareUro décline toute responsabilité pour toute décision d'achat prise sur la base des informations affichées.</p>
            </>
          ),
        },
        {
          title: "4. Liens d'affiliation",
          content: (
            <>
              <p>CompareUro participe au <strong>Programme Partenaires d'Amazon Europe</strong> (Amazon Associates). Les liens vers Amazon présents sur le Service sont des liens d'affiliation : si vous effectuez un achat dans les 24 heures suivant un clic sur l'un de ces liens, CompareUro perçoit une commission de la part d'Amazon.</p>
              <p style={{ marginTop: 10 }}>Cette commission est versée par Amazon et n'entraîne <strong>aucun surcoût</strong> pour vous. Le prix que vous payez sur Amazon est identique, qu'il y ait ou non un lien affilié.</p>
              <p style={{ marginTop: 10 }}>Pour en savoir plus, consultez notre <a href="/affiliation" style={{ color: "var(--blue)", textDecoration: "underline" }}>page dédiée à l'affiliation</a>.</p>
            </>
          ),
        },
        {
          title: "5. Propriété intellectuelle",
          content: (
            <p>L'ensemble du contenu du Service (code source, design, textes, logo, animations) est la propriété exclusive d'CompareUro et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation préalable est interdite.</p>
          ),
        },
        {
          title: "6. Données personnelles",
          content: (
            <>
              <p>CompareUro ne collecte pas de données personnelles identifiables sans votre consentement explicite. Les données d'utilisation anonymes peuvent être collectées via des outils d'analyse (Vercel Analytics) dans le but d'améliorer le Service.</p>
              <p style={{ marginTop: 10 }}>Pour en savoir plus, consultez notre <a href="/confidentialite" style={{ color: "var(--blue)", textDecoration: "underline" }}>politique de confidentialité</a>.</p>
            </>
          ),
        },
        {
          title: "7. Limitation de responsabilité",
          content: (
            <p>CompareUro est fourni « en l'état ». L'éditeur ne garantit pas l'absence d'erreurs, d'interruptions ou d'inexactitudes. En aucun cas CompareUro ne pourra être tenu responsable de tout dommage direct ou indirect résultant de l'utilisation du Service ou de l'impossibilité d'y accéder.</p>
          ),
        },
        {
          title: "8. Modifications des CGU",
          content: (
            <p>CompareUro se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur cette page. L'utilisation continue du Service après modification vaut acceptation des nouvelles conditions.</p>
          ),
        },
        {
          title: "9. Droit applicable et juridiction",
          content: (
            <p>Les présentes CGU sont régies par le droit français. En cas de litige relatif à l'utilisation du Service, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.</p>
          ),
        },
        {
          title: "10. Contact",
          content: (
            <p>Pour toute question relative aux présentes CGU, vous pouvez nous contacter via la <a href="/contact" style={{ color: "var(--blue)", textDecoration: "underline" }}>page de contact</a> ou par e-mail à <a href="mailto:contact@compareuro.com" style={{ color: "var(--blue)", textDecoration: "underline" }}>contact@compareuro.com</a>.</p>
          ),
        },
      ]}
    />
  )
}
