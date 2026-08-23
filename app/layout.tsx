import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "./site";

// Faits réellement publiables sur le site (nom, téléphone, zone) — aucune adresse postale
// complète ni certification tant qu'elles restent "à confirmer" ailleurs sur le site.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "T.A.F Qualité",
  telephone: "+33766832030",
  areaServed: "Angers et alentours",
  address: { "@type": "PostalAddress", addressLocality: "Angers", addressCountry: "FR" },
  url: siteUrl,
};

export const metadata: Metadata = {
  title: "T.A.F Qualité — Prototype",
  description: "Prototype mobile-first de T.A.F Qualité, travaux et rénovation à Angers.",
  metadataBase: new URL(siteUrl),
  openGraph: { siteName: "T.A.F Qualité", locale: "fr_FR", type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} /></body></html>; }
