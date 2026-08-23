import { Prototype } from "./prototype";
import { siteConfig } from "./config";
import { buildHomeMetadata, buildWhatsappUrl } from "./config/helpers";

export const metadata = buildHomeMetadata(siteConfig);

export default function Home() {
  return (
    <>
      <a className="home-phone" href={buildWhatsappUrl(siteConfig.contact)} target="_blank" rel="noreferrer" aria-label="Échanger avec nous sur WhatsApp">
        <i aria-hidden="true">☎</i>
        <span>
          <small>UNE QUESTION ?</small>
          <b>{siteConfig.contact.phoneDisplay}</b>
        </span>
      </a>
      <Prototype initialPage="accueil" />
    </>
  );
}
