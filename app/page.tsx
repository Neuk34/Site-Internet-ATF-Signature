import { Prototype } from "./prototype";
import { siteConfig } from "./config";
import { buildHomeMetadata } from "./config/helpers";

export const metadata = buildHomeMetadata(siteConfig);

export default function Home() {
  return (
    <>
      <a
        className="home-phone"
        href={`tel:${siteConfig.contact.phoneInternational}`}
        aria-label={`Appeler Majid au ${siteConfig.contact.phoneDisplay}`}
      >
        <span className="home-phone-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
          </svg>
        </span>
        <span className="home-phone-text">
          <b>Nous contacter</b>
          <small>{siteConfig.contact.phoneDisplay}</small>
        </span>
      </a>
      <Prototype initialPage="accueil" />
    </>
  );
}
