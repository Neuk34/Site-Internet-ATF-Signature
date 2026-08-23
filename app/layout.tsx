import "./globals.css";
import { siteConfig } from "./config";
import { siteMetadataBase } from "./config/helpers";

// Faits réellement publiables sur le site (nom, téléphone, zone) — aucune adresse postale
// complète ni certification tant qu'elles restent "à confirmer" ailleurs sur le site.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.business.name,
  telephone: siteConfig.contact.phoneInternational,
  areaServed: siteConfig.serviceArea.label,
  address: { "@type": "PostalAddress", addressLocality: siteConfig.serviceArea.city, addressCountry: "FR" },
  url: siteConfig.seo.siteUrl,
};

export const metadata = siteMetadataBase(siteConfig);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      </body>
    </html>
  );
}
