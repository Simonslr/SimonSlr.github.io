import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | ComparEuro",
  description: "Une question, un partenariat, un signalement ? Contactez l'équipe ComparEuro.",
  alternates: { canonical: "/contact" },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
