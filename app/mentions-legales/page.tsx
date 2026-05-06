import type { Metadata } from "next"
import InfoPageLayout from "@/components/InfoPageLayout"

export const metadata: Metadata = {
  title: "Mentions légales | EuroPrix",
}

export default function MentionsLegalesPage() {
  return (
    <InfoPageLayout
      title="Mentions légales"
      updatedAt="7 mai 2026"
      sections={[
        {
          title: "Éditeur du site",
          content: (
            <>
              <p>EuroPrix est un site indépendant édité à titre personnel.</p>
              <p>Contact : <a href="mailto:contact@europrix.fr" className="text-indigo-600 hover:underline">contact@europrix.fr</a></p>
            </>
          ),
        },
        {
          title: "Hébergement",
          content: (
            <>
              <p>Le site EuroPrix est hébergé par Vercel Inc., 340 Pine Street, San Francisco, CA 94104, États-Unis.</p>
              <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">vercel.com</a></p>
            </>
          ),
        },
        {
          title: "Programme d'affiliation Amazon",
          content: (
            <p>EuroPrix est participant au Programme Partenaires d'Amazon EU, un programme d'affiliation conçu pour permettre à des sites de percevoir une rémunération grâce à la création de liens vers Amazon.fr, Amazon.de et Amazon.es. En tant que Partenaire Amazon, EuroPrix perçoit des revenus sur les achats éligibles. EuroPrix n'est pas affilié à Amazon en dehors de ce programme.</p>
          ),
        },
        {
          title: "Propriété intellectuelle",
          content: (
            <p>L'ensemble des contenus présents sur EuroPrix (textes, visuels, code, logo) sont la propriété exclusive de l'éditeur et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, totale ou partielle, est interdite sans autorisation préalable.</p>
          ),
        },
        {
          title: "Limitation de responsabilité",
          content: (
            <>
              <p>Les prix affichés sur EuroPrix sont fournis à titre indicatif et peuvent ne pas refléter les prix en temps réel sur Amazon. L'éditeur décline toute responsabilité en cas d'erreur, d'omission ou d'inexactitude dans les informations présentées.</p>
              <p>Les liens vers des sites tiers (Amazon.fr, Amazon.de, Amazon.es) ne constituent pas une approbation de ces sites par EuroPrix. L'éditeur ne saurait être tenu responsable du contenu de ces sites externes.</p>
            </>
          ),
        },
        {
          title: "Droit applicable",
          content: (
            <p>Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          ),
        },
      ]}
    />
  )
}
