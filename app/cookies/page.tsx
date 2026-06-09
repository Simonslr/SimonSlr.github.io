import type { Metadata } from "next"
import InfoPageLayout from "@/components/InfoPageLayout"

export const metadata: Metadata = {
  title: "Politique de cookies | CompareUro",
}

export default function CookiesPage() {
  return (
    <InfoPageLayout
      title="Politique de cookies"
      subtitle="Quels cookies utilisons-nous et pourquoi."
      updatedAt="7 mai 2026"
      sections={[
        {
          title: "Qu'est-ce qu'un cookie ?",
          content: (
            <p>Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, mobile) lors de votre visite sur un site web. Il permet au site de mémoriser certaines informations sur votre navigation.</p>
          ),
        },
        {
          title: "Cookies utilisés par CompareUro",
          content: (
            <>
              <p>CompareUro utilise uniquement des <strong>cookies strictement nécessaires</strong> au bon fonctionnement du site :</p>
              <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-3 gap-0 bg-slate-50 px-4 py-2.5 font-bold text-slate-500 uppercase tracking-wider">
                  <span>Nom</span><span>Durée</span><span>Finalité</span>
                </div>
                <div className="grid grid-cols-3 gap-0 px-4 py-3 border-t border-slate-100">
                  <span className="font-mono text-slate-700">__session</span>
                  <span>Session</span>
                  <span className="text-slate-500">Sécurité de la session</span>
                </div>
                <div className="grid grid-cols-3 gap-0 px-4 py-3 border-t border-slate-100">
                  <span className="font-mono text-slate-700">dc-viewport:*</span>
                  <span>Session</span>
                  <span className="text-slate-500">Mémorisation du zoom (lecture seule)</span>
                </div>
              </div>
              <p className="mt-3">Nous n'utilisons <strong>aucun cookie de tracking, d'analyse comportementale ou publicitaire</strong>.</p>
            </>
          ),
        },
        {
          title: "Cookies Amazon (tiers)",
          content: (
            <>
              <p>Lorsque vous cliquez sur un lien affilié Amazon depuis notre site, Amazon peut déposer des cookies de session sur votre navigateur afin de tracker la vente à des fins de rémunération affiliée. Ces cookies sont déposés par Amazon, pas par CompareUro.</p>
              <p>Vous pouvez consulter la politique de cookies d'Amazon sur leur site officiel.</p>
            </>
          ),
        },
        {
          title: "Gérer vos préférences",
          content: (
            <>
              <p>Vous pouvez configurer votre navigateur pour bloquer ou supprimer les cookies. Voici comment procéder selon votre navigateur :</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Chrome</strong> : Paramètres → Confidentialité et sécurité → Cookies</li>
                <li><strong>Firefox</strong> : Options → Vie privée et sécurité → Cookies</li>
                <li><strong>Safari</strong> : Préférences → Confidentialité → Cookies</li>
                <li><strong>Edge</strong> : Paramètres → Confidentialité → Cookies</li>
              </ul>
              <p className="mt-3">Notez que la désactivation des cookies strictement nécessaires peut affecter le bon fonctionnement du site.</p>
            </>
          ),
        },
      ]}
    />
  )
}
